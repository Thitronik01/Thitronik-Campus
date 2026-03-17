import jsPDF from "jspdf";

export interface NoteForPdf {
    title: string;
    text: string;
    createdAt: string;
    handwritingImage?: string;
}

/**
 * Generate a PDF for a single note.
 */
export function exportNotePdf(note: NoteForPdf) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = w - margin * 2;
    let y = 20;

    // ── Header bar ──
    doc.setFillColor(29, 54, 97); // brand-navy
    doc.rect(0, 0, w, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("THITRONIK Campus", margin, 13);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Notizen", margin, 22);

    // ── Accent line ──
    doc.setFillColor(59, 169, 211); // brand-sky
    doc.rect(0, 28, w, 2, "F");

    y = 42;

    // ── Title ──
    doc.setTextColor(29, 54, 97);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(note.title || "Ohne Titel", margin, y);
    y += 8;

    // ── Date ──
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date(note.createdAt).toLocaleString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
    doc.text(`Erstellt: ${dateStr}`, margin, y);
    y += 10;

    // ── Divider ──
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, w - margin, y);
    y += 8;

    // ── Text body ──
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(note.text || "(Kein Text)", contentWidth);
    for (const line of lines) {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
    }

    // ── Handwriting image ──
    if (note.handwritingImage) {
        y += 8;
        if (y > 200) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("Handschrift:", margin, y);
        y += 5;
        try {
            doc.addImage(note.handwritingImage, "PNG", margin, y, contentWidth, 60);
            y += 65;
        } catch {
            doc.text("(Bild konnte nicht geladen werden)", margin, y);
            y += 6;
        }
    }

    // ── Footer ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `THITRONIK® Campus · Notizen · Seite ${i}/${pageCount}`,
            w / 2,
            290,
            { align: "center" }
        );
    }

    const date = new Date().toISOString().slice(0, 10);
    doc.save(`Notiz_${date}_${(note.title || "Notiz").replace(/\s+/g, "_").substring(0, 20)}.pdf`);
}

/**
 * Export all notes as one PDF.
 */
export function exportAllNotesPdf(notes: NoteForPdf[]) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = w - margin * 2;

    notes.forEach((note, idx) => {
        if (idx > 0) doc.addPage();
        let y = 20;

        // Header
        doc.setFillColor(29, 54, 97);
        doc.rect(0, 0, w, 28, "F");
        doc.setTextColor(255);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("THITRONIK Campus", margin, 13);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Notiz ${idx + 1} von ${notes.length}`, margin, 22);

        doc.setFillColor(59, 169, 211);
        doc.rect(0, 28, w, 2, "F");

        y = 42;
        doc.setTextColor(29, 54, 97);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(note.title || "Ohne Titel", margin, y);
        y += 8;

        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        const dateStr = new Date(note.createdAt).toLocaleString("de-DE", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
        doc.text(`Erstellt: ${dateStr}`, margin, y);
        y += 10;

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, w - margin, y);
        y += 8;

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(note.text || "(Kein Text)", contentWidth);
        for (const line of lines) {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(line, margin, y);
            y += 6;
        }

        if (note.handwritingImage) {
            y += 8;
            if (y > 200) { doc.addPage(); y = 20; }
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text("Handschrift:", margin, y);
            y += 5;
            try {
                doc.addImage(note.handwritingImage, "PNG", margin, y, contentWidth, 60);
            } catch { /* skip */ }
        }
    });

    // Page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `THITRONIK® Campus · Alle Notizen · Seite ${i}/${pageCount}`,
            w / 2,
            290,
            { align: "center" }
        );
    }

    const date = new Date().toISOString().slice(0, 10);
    doc.save(`Notizen_${date}.pdf`);
}
