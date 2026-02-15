"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  forwardRef,
} from "react";
import HTMLFlipBook from "react-pageflip";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  BookOpen,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface PdfFlipbookProps {
  pdfUrl: string;
  title?: string;
}

interface PageImageData {
  src: string;
  width: number;
  height: number;
}

// ─── Single Page Component (required by react-pageflip) ──────────────
const PageComponent = forwardRef<
  HTMLDivElement,
  { number: number; image: string; width: number; height: number }
>(function PageComponent({ number, image, width, height }, ref) {
  return (
    <div
      ref={ref}
      className="page-content"
      style={{
        width,
        height,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`صفحة ${number}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            draggable={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-sm font-medium">صفحة {number}</span>
          </div>
        )}
      </div>
    </div>
  );
});

// ─── Main FlipBook Component ─────────────────────────────────────────
export default function PdfFlipbook({ pdfUrl, title }: PdfFlipbookProps) {
  // State
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<Map<number, PageImageData>>(
    new Map(),
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pageSize, setPageSize] = useState({ width: 400, height: 566 });
  const [pdfReady, setPdfReady] = useState(false);

  // Refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderQueueRef = useRef<Set<number>>(new Set());
  const renderedPagesRef = useRef<Set<number>>(new Set());

  // ─── Detect mobile ──────────────────────────────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ─── Render a single PDF page to image ─────────────────────
  const renderPage = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf: any,
      pageNum: number,
      targetWidth: number,
      targetHeight: number,
    ): Promise<PageImageData | null> => {
      try {
        const page = await pdf.getPage(pageNum);
        const vp = page.getViewport({ scale: 1 });

        // Render at 2x for sharp text
        const scaleFactor = (targetWidth / vp.width) * 2;
        const viewport = page.getViewport({ scale: scaleFactor });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        await page.render({ canvasContext: ctx, viewport }).promise;

        return {
          src: canvas.toDataURL("image/jpeg", 0.85),
          width: targetWidth,
          height: targetHeight,
        };
      } catch (e) {
        console.error(`[FlipBook] Error rendering page ${pageNum}:`, e);
        return null;
      }
    },
    [],
  );

  // ─── Load PDF ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      console.log("[FlipBook] Loading PDF:", pdfUrl);
      setLoading(true);
      setError(null);
      setPdfReady(false);
      setPageImages(new Map());
      renderedPagesRef.current = new Set();
      renderQueueRef.current = new Set();

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        if (cancelled) return;

        console.log("[FlipBook] PDF loaded:", pdf.numPages, "pages");
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);

        // Get page size from first page
        const firstPage = await pdf.getPage(1);
        const vp = firstPage.getViewport({ scale: 1 });
        const aspect = vp.height / vp.width;

        const containerWidth = containerRef.current?.clientWidth || 900;
        const maxPageWidth = isMobile
          ? Math.min(containerWidth - 40, 380)
          : Math.min((containerWidth - 60) / 2, 450);
        const pageW = maxPageWidth;
        const pageH = Math.round(pageW * aspect);

        setPageSize({ width: pageW, height: pageH });
        console.log("[FlipBook] Page size:", pageW, "x", pageH);

        // Pre-render first batch of pages
        const initialCount = Math.min(8, pdf.numPages);
        const images = new Map<number, PageImageData>();

        for (let i = 1; i <= initialCount; i++) {
          if (cancelled) return;
          const img = await renderPage(pdf, i, pageW, pageH);
          if (img) images.set(i, img);
        }

        if (cancelled) return;

        setPageImages(new Map(images));
        renderedPagesRef.current = new Set(images.keys());
        setLoading(false);
        setPdfReady(true);

        // RTL: start at the end of the reversed array (= Quran page 1)
        const isOdd = pdf.numPages % 2 !== 0;
        const total = pdf.numPages + (isOdd ? 1 : 0);
        setCurrentPage(total - 2); // left page index of last spread
        console.log("[FlipBook] Ready! Initial pages:", initialCount);
      } catch (err) {
        if (cancelled) return;
        console.error("[FlipBook] PDF load error:", err);
        setError("فشل تحميل ملف PDF. تأكد من صحة الرابط.");
        setLoading(false);
      }
    };

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl, isMobile, renderPage]);

  // ─── Lazy-load pages around current view ───────────────────
  const ensurePagesRendered = useCallback(
    async (centerPage: number) => {
      if (!pdfDocRef.current) return;

      const range = 5;
      const start = Math.max(1, centerPage - range);
      const end = Math.min(numPages, centerPage + range);
      const toRender: number[] = [];

      for (let i = start; i <= end; i++) {
        if (
          !renderedPagesRef.current.has(i) &&
          !renderQueueRef.current.has(i)
        ) {
          toRender.push(i);
          renderQueueRef.current.add(i);
        }
      }

      if (toRender.length === 0) return;
      console.log("[FlipBook] Lazy-rendering:", toRender);

      for (const pageNum of toRender) {
        const img = await renderPage(
          pdfDocRef.current,
          pageNum,
          pageSize.width,
          pageSize.height,
        );
        if (img) {
          renderedPagesRef.current.add(pageNum);
          renderQueueRef.current.delete(pageNum);
          setPageImages((prev) => {
            const next = new Map(prev);
            next.set(pageNum, img);
            return next;
          });
        }
      }
    },
    [numPages, pageSize, renderPage],
  );

  // ─── RTL helpers ──────────────────────────────────────────
  // Pages are reversed: [blank?, pN, pN-1, ..., p2, p1]
  const isOddPages = numPages % 2 !== 0;
  const blankOffset = isOddPages ? 1 : 0;
  const totalChildren = numPages + blankOffset;

  // Convert flipbook index → Quran page number
  const flipToQuran = useCallback(
    (flipIdx: number) => numPages - flipIdx + blankOffset,
    [numPages, blankOffset],
  );
  // Convert Quran page → flipbook index
  const quranToFlip = useCallback(
    (quranPage: number) => numPages - quranPage + blankOffset,
    [numPages, blankOffset],
  );

  // ─── Page flip event ──────────────────────────────────────
  const onFlip = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const flipIdx = e.data;
      setCurrentPage(flipIdx);
      // Lazy-load pages around the current Quran page
      const quranPage = flipToQuran(flipIdx);
      console.log(
        "[FlipBook] Flip index:",
        flipIdx,
        "→ Quran page:",
        quranPage,
      );
      ensurePagesRendered(quranPage);
    },
    [ensurePagesRendered, flipToQuran],
  );

  // ─── Navigation (SWAPPED for RTL) ─────────────────────────
  // In reversed array: flipPrev = lower index = higher Quran page = "next" in Arabic
  const nextPage = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const prevPage = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  const goToPage = useCallback(
    (quranPage: number) => {
      if (quranPage >= 1 && quranPage <= numPages) {
        const flipIdx = quranToFlip(quranPage);
        flipBookRef.current?.pageFlip()?.flip(flipIdx);
      }
    },
    [numPages, quranToFlip],
  );

  // ─── Keyboard navigation ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      if (e.key === "ArrowLeft") {
        nextPage(); // Arabic: left = next
      } else if (e.key === "ArrowRight") {
        prevPage(); // Arabic: right = prev
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage]);

  // ─── Zoom ─────────────────────────────────────────────────
  const zoomIn = () => setScale((s) => Math.min(s + 0.15, 2));
  const zoomOut = () => setScale((s) => Math.max(s - 0.15, 0.6));

  // ─── Fullscreen ───────────────────────────────────────────
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.error("[FlipBook] Fullscreen error:", e);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ─── RTL page display ─────────────────────────────────────
  // In reversed array, library's currentPage = left page index
  // Left page has HIGHER Quran number, right page has LOWER
  const leftQuranPage = Math.max(
    1,
    Math.min(numPages, flipToQuran(currentPage)),
  );
  const rightQuranPage = Math.max(1, leftQuranPage - 1);
  const currentQuranPage = isMobile ? leftQuranPage : rightQuranPage;

  const getDisplayPage = () => {
    if (numPages === 0) return "0";
    if (isMobile) return `${leftQuranPage}`;
    if (rightQuranPage === leftQuranPage) return `${leftQuranPage}`;
    return `${rightQuranPage} - ${leftQuranPage}`;
  };

  // ─── Build children array for HTMLFlipBook ────────────────
  const flipbookChildren = useMemo(() => {
    const children: React.ReactElement[] = [];

    // Add blank page if odd number of pages (for proper pairing)
    if (isOddPages) {
      children.push(
        <PageComponent
          key="blank-cover"
          number={0}
          image=""
          width={pageSize.width}
          height={pageSize.height}
        />,
      );
    }

    // Add pages in reverse: N, N-1, ..., 2, 1
    for (let i = 0; i < numPages; i++) {
      const pageNum = numPages - i;
      const imgData = pageImages.get(pageNum);
      children.push(
        <PageComponent
          key={pageNum}
          number={pageNum}
          image={imgData?.src || ""}
          width={pageSize.width}
          height={pageSize.height}
        />,
      );
    }

    return children;
  }, [isOddPages, numPages, pageImages, pageSize.width, pageSize.height]);

  // ─── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-125 bg-card rounded-3xl shadow-xl border border-primary/10">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-foreground font-semibold text-lg">
            جاري تحميل المصحف...
          </p>
          <p className="text-muted-foreground text-sm">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-100 bg-card rounded-3xl shadow-xl border border-red-200">
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-3xl">✕</span>
          </div>
          <p className="text-foreground font-semibold text-lg">
            خطأ في التحميل
          </p>
          <p className="text-muted-foreground max-w-sm">{error}</p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`relative bg-card rounded-3xl overflow-hidden shadow-2xl border border-primary/20 ${
        isFullscreen ? "fixed inset-0 z-9999 rounded-none bg-black" : ""
      }`}
      dir="rtl"
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-secondary/95 backdrop-blur-sm border-b border-primary/20 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary shrink-0" size={22} />
            <h3 className="text-base md:text-lg font-bold text-foreground truncate max-w-45 md:max-w-none">
              {title || "المصحف الشريف"}
            </h3>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              صفحة {getDisplayPage()} من {numPages}
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.6}
              className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="تصغير"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs text-muted-foreground w-10 text-center hidden md:block">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 2}
              className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="تكبير"
            >
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-6 bg-primary/20 mx-1 hidden md:block" />
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition"
              title={isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Book Area ───────────────────────────────────── */}
      <div
        className={`relative flex items-center justify-center overflow-auto ${
          isFullscreen ? "h-[calc(100vh-120px)]" : "h-112.5 md:h-175"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, #f5f0e8 0%, #e8e0d4 40%, #d4ccc0 100%)",
        }}
      >
        {/* Zoom wrapper — CSS transform for smooth zoom */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transition: "transform 0.25s ease",
            zIndex: 1,
          }}
        >
          {/* Book shadow */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow:
                "0 15px 50px rgba(0,0,0,0.3), 0 5px 20px rgba(0,0,0,0.15)",
              borderRadius: 8,
              zIndex: 0,
            }}
          />

          {/* FlipBook */}
          {pdfReady && flipbookChildren.length > 0 && (
            <HTMLFlipBook
              ref={flipBookRef}
              width={pageSize.width}
              height={pageSize.height}
              size="fixed"
              minWidth={280}
              maxWidth={700}
              minHeight={380}
              maxHeight={1000}
              showCover={false}
              mobileScrollSupport={true}
              onFlip={onFlip}
              className="flipbook-container"
              style={{}}
              startPage={Math.max(0, totalChildren - 1)}
              drawShadow={true}
              flippingTime={800}
              usePortrait={isMobile}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.5}
              showPageCorners={true}
              disableFlipByClick={false}
              useMouseEvents={true}
              swipeDistance={30}
              clickEventForward={true}
            >
              {flipbookChildren}
            </HTMLFlipBook>
          )}
        </div>
      </div>

      {/* ── Navigation Footer ──────────────────────────── */}
      <div className="sticky bottom-0 z-30 bg-secondary/95 backdrop-blur-sm border-t border-primary/20 px-4 py-3">
        <div className="flex items-center justify-center gap-3 md:gap-4 max-w-7xl mx-auto">
          <button
            onClick={nextPage}
            disabled={currentQuranPage >= numPages}
            className="flex items-center gap-1.5 px-4 md:px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg text-sm md:text-base"
          >
            <ChevronLeft size={18} />
            <span>التالي</span>
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={numPages}
              value={currentQuranPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= numPages) {
                  goToPage(val);
                }
              }}
              className="w-16 md:w-20 px-2 py-2 text-center rounded-lg bg-background border border-primary/20 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              dir="ltr"
            />
            <span className="text-muted-foreground text-sm hidden md:inline">
              / {numPages}
            </span>
          </div>

          <button
            onClick={prevPage}
            disabled={currentQuranPage <= 1}
            className="flex items-center gap-1.5 px-4 md:px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg text-sm md:text-base"
          >
            <span>السابق</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Global styles for flipbook ──────────────────── */}
      <style jsx global>{`
        .flipbook-container {
          margin: 0 auto;
        }
        .stf__parent {
          margin: 0 auto !important;
        }
        .page-content {
          box-shadow:
            inset 0 0 30px rgba(0, 0, 0, 0.04),
            inset -3px 0 8px rgba(0, 0, 0, 0.03);
        }
        .stf__block {
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
