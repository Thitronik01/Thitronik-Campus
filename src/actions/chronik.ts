"use server";

import { createClient } from "@/lib/supabase/server";
import { ChronikEntry } from "@/types/chronik";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

const MOCK_CHRONIK_ENTRIES: ChronikEntry[] = [
  // 2026
  {
    id: "mock-2026-q4",
    year: 2026,
    title: "Ausblick 2030: Zukunft der Sicherheit",
    description: "Präsentation der Roadmap 2030. Fokus auf vollautonome Absicherung und biometrische Zugangssysteme für alle Fahrzeugklassen.",
    images: [{ id: "img-2026-4", publicUrl: "/chronik/2026_global.png", caption: "Visionäre Konzepte für das nächste Jahrzehnt.", chronik_id: "mock-2026-q4", storage_path: "", sort_order: 1 }],
    video_url: null,
    sort_order: 1,
    created_at: new Date(2026, 11, 1).toISOString(),
    comments: [
      { id: "c1", user_name: "Tech-Enthusiast", content: "Die Roadmap klingt extrem vielversprechend! Biometrie im Camper wäre genial.", created_at: new Date(2026, 11, 2).toISOString(), user_id: "u1", chronik_id: "mock-2026-q4" },
      { id: "c1-2", user_name: "Admin", content: "Wir arbeiten hart daran, diese Visionen Realität werden zu lassen.", created_at: new Date(2026, 11, 3).toISOString(), user_id: "admin", chronik_id: "mock-2026-q4" }
    ]
  },
  {
    id: "mock-2026-q3",
    year: 2026,
    title: "10-jähriges Jubiläum 'Sicheres Reisen'",
    description: "Ein Jahrzehnt Innovation. Wir feiern 10 Jahre WiPro-Serie und danken unseren treuen Partnern für das Vertrauen über die Jahre.",
    images: [{ id: "img-2026-3", publicUrl: "/chronik/2024_award.png", caption: "Jubiläumsfeier am Campus mit allen Partnern.", chronik_id: "mock-2026-q3", storage_path: "", sort_order: 2 }],
    video_url: null,
    sort_order: 2,
    created_at: new Date(2026, 8, 15).toISOString(),
    comments: [
      { id: "c2", user_name: "Caravan-Fan", content: "Auf die nächsten 10 Jahre! Ihr seid die Besten.", created_at: new Date(2026, 8, 16).toISOString(), user_id: "u2", chronik_id: "mock-2026-q3" },
      { id: "c2-2", user_name: "Händler-Süd", content: "Stolzer Partner seit Tag 1. Danke für die tolle Unterstützung.", created_at: new Date(2026, 8, 17).toISOString(), user_id: "u22", chronik_id: "mock-2026-q3" }
    ]
  },
  {
    id: "mock-2026-q2",
    year: 2026,
    title: "KI-Support 'THI' Live-Gang",
    description: "Unser KI-Assistent 'THI' unterstützt ab sofort Partner bei der Installation und Fehlerdiagnose in Echtzeit direkt über die Plattform.",
    images: [{ id: "img-2026-2", publicUrl: "/chronik/2025_digital.png", caption: "KI-Unterstützung für zertifizierte Techniker.", chronik_id: "mock-2026-q2", storage_path: "", sort_order: 3 }],
    video_url: null,
    sort_order: 3,
    created_at: new Date(2026, 5, 10).toISOString(),
    comments: [{ id: "c3", user_name: "Admin", content: "Ein riesiger Fortschritt für unseren Vor-Ort-Support. THI lernt jeden Tag dazu.", created_at: new Date(2026, 5, 11).toISOString(), user_id: "admin", chronik_id: "mock-2026-q2" }]
  },
  {
    id: "mock-2026-q1",
    year: 2026,
    title: "Rollout in 5 neue Märkte",
    description: "THITRONIK expandiert nach Skandinavien und Südeuropa. Wir begrüßen over 200 neue Partnerbetriebe in unserem Netzwerk.",
    images: [{ id: "img-2026-1", publicUrl: "/chronik/2026_global.png", caption: "Internationale Vernetzung und Expansion.", chronik_id: "mock-2026-q1", storage_path: "", sort_order: 4 }],
    video_url: null,
    sort_order: 4,
    created_at: new Date(2026, 1, 5).toISOString(),
    comments: [
      { id: "c4", user_name: "Partner-Nord", content: "Välkommen! Wir freuen uns auf die Zusammenarbeit aus Schweden.", created_at: new Date(2026, 1, 6).toISOString(), user_id: "u4", chronik_id: "mock-2026-q1" },
      { id: "c4-2", user_name: "Marco", content: "Spanien ist bereit für Thitronik!", created_at: new Date(2026, 1, 7).toISOString(), user_id: "u44", chronik_id: "mock-2026-q1" }
    ]
  },
  // 2025
  {
    id: "mock-2025-q4",
    year: 2025,
    title: "Green Security Tech Siegel",
    description: "Auszeichnung für nachhaltige Produktion und langlebige Komponenten. Wir setzen auf 100% Ökostrom am Campus Eckernförde.",
    images: [{ id: "img-2025-4", publicUrl: "/chronik/2023_campus.png", caption: "Nachhaltigkeit am Standort Eckernförde.", chronik_id: "mock-2025-q4", storage_path: "", sort_order: 1 }],
    video_url: null,
    sort_order: 1,
    created_at: new Date(2025, 10, 20).toISOString(),
    comments: [{ id: "c5", user_name: "Eco-Wanderer", content: "Endlich ein Hersteller, der auch an die Umwelt denkt. Top!", created_at: new Date(2025, 10, 21).toISOString(), user_id: "u5", chronik_id: "mock-2025-q4" }]
  },
  {
    id: "mock-2025-q3",
    year: 2025,
    title: "Integration von VR-Schulungen",
    description: "Virtuelle Installationstrainings ermöglichen es Partnern, komplexe Systeme in 3D zu erleben, bevor sie am echten Fahrzeug arbeiten.",
    images: [{ id: "img-2025-3", publicUrl: "/chronik/2025_vr.png", caption: "Virtual Reality Training im Thitronik Campus.", chronik_id: "mock-2025-q3", storage_path: "", sort_order: 2 }],
    video_url: null,
    sort_order: 2,
    created_at: new Date(2025, 7, 12).toISOString(),
    comments: [
      { id: "c6", user_name: "Technik-Freak", content: "Die VR-Trainings sind absolut genial! Man sieht jedes Detail.", created_at: new Date(2025, 7, 13).toISOString(), user_id: "u6", chronik_id: "mock-2025-q3" },
      { id: "c6-2", user_name: "Azubi-Lukas", content: "Hat mir sehr beim Verständnis der WiPro-Verkabelung geholfen.", created_at: new Date(2025, 7, 14).toISOString(), user_id: "u66", chronik_id: "mock-2025-q3" }
    ]
  },
  {
    id: "mock-2025-q2",
    year: 2025,
    title: "Launch Campus 2.0 Plattform",
    description: "Die neue digitale Heimat für alle Partner. Kurse, Zertifikate und Community-Features - alles an einem Ort.",
    images: [{ id: "img-2025-2", publicUrl: "/chronik/2025_digital.png", caption: "Das neue digitale Dashboard.", chronik_id: "mock-2025-q2", storage_path: "", sort_order: 3 }],
    video_url: null,
    sort_order: 3,
    created_at: new Date(2025, 4, 1).toISOString(),
    comments: [{ id: "c7", user_name: "Marco Polo", content: "Ein Quantensprung im Vergleich zur alten Plattform. Sehr intuitiv.", created_at: new Date(2025, 4, 2).toISOString(), user_id: "u3", chronik_id: "mock-2025-q2" }]
  },
  {
    id: "mock-2025-q1",
    year: 2025,
    title: "Digital Excellence Initiative",
    description: "Strategische Neuausrichtung auf vollvernetzte Sicherheitslösungen und intelligente Cloud-Anbindung.",
    images: [{ id: "img-2025-1", publicUrl: "/chronik/2026_global.png", caption: "Digitale Transformation.", chronik_id: "mock-2025-q1", storage_path: "", sort_order: 4 }],
    video_url: null,
    sort_order: 4,
    created_at: new Date(2025, 1, 10).toISOString(),
    comments: [{ id: "c8", user_name: "Partner-NRW", content: "Wichtiger Schritt in die richtige Richtung. Vernetzung ist die Zukunft.", created_at: new Date(2025, 1, 11).toISOString(), user_id: "u8", chronik_id: "mock-2025-q1" }]
  },
  // 2024
  {
    id: "mock-2024-q4",
    year: 2024,
    title: "Großauftrag europäischer Marktführer",
    description: "THITRONIK wird Exklusiv-Partner für einen der größten Reisemobil-Hersteller Europas in der Erstausrüstung.",
    images: [{ id: "img-2024-4", publicUrl: "/chronik/2026_global.png", caption: "Starke Partnerschaften in der Industrie.", chronik_id: "mock-2024-q4", storage_path: "", sort_order: 1 }],
    video_url: null,
    sort_order: 1,
    created_at: new Date(2024, 11, 5).toISOString(),
    comments: [{ id: "c9", user_name: "Admin", content: "Ein großer Erfolg für das gesamte Team! Das sichert unsere Zukunft.", created_at: new Date(2024, 11, 6).toISOString(), user_id: "admin", chronik_id: "mock-2024-q4" }]
  },
  {
    id: "mock-2024-q3",
    year: 2024,
    title: "1000. zertifizierter Partner am Campus",
    description: "Wir feiern den tausendsten Absolventen unserer Experten-Schulung im neuen Schulungszentrum.",
    images: [{ id: "img-2024-3", publicUrl: "/chronik/2023_grand_opening.png", caption: "Feierliche Zertifikat-Übergabe an den 1000. Partner.", chronik_id: "mock-2024-q3", storage_path: "", sort_order: 2 }],
    video_url: null,
    sort_order: 2,
    created_at: new Date(2024, 8, 20).toISOString(),
    comments: [
      { id: "c10", user_name: "Stolzer-Partner", content: "Ich war Nummer 1002! Fast geschafft, hahah.", created_at: new Date(2024, 8, 21).toISOString(), user_id: "u10", chronik_id: "mock-2024-q3" },
      { id: "c10-2", user_name: "Händler-West", content: "War eine tolle Feier, danke für die Einladung!", created_at: new Date(2024, 8, 22).toISOString(), user_id: "u102", chronik_id: "mock-2024-q3" }
    ]
  },
  {
    id: "mock-2024-q2",
    year: 2024,
    title: "Launch Thitronik App 2.0",
    description: "Kompletter Relaunch der Nutzer-App mit intuitiver Steuerung, Push-Benachrichtigungen und Status-Abfrage in Echtzeit.",
    images: [{ id: "img-2024-2", publicUrl: "/chronik/2024_app.png", caption: "Sicherheit intuitiv gesteuert.", chronik_id: "mock-2024-q2", storage_path: "", sort_order: 3 }],
    video_url: null,
    sort_order: 3,
    created_at: new Date(2024, 4, 15).toISOString(),
    comments: [{ id: "c11", user_name: "Camping-Guru", content: "Endlich eine App, die wirklich funktioniert und gut aussieht.", created_at: new Date(2024, 4, 16).toISOString(), user_id: "u11", chronik_id: "mock-2024-q2" }]
  },
  {
    id: "mock-2024-q1",
    year: 2024,
    title: "Innovation Award: WiPro III",
    description: "Die WiPro III wird zum Produkt des Jahres gewählt. Eine Bestätigung für unsere kontinuierliche Entwicklungsarbeit.",
    images: [{ id: "img-2024-1", publicUrl: "/chronik/2024_award.png", caption: "Der Innovationspreis 2024.", chronik_id: "mock-2024-q1", storage_path: "", sort_order: 4 }],
    video_url: null,
    sort_order: 4,
    created_at: new Date(2024, 1, 1).toISOString(),
    comments: [{ id: "c12", user_name: "Sabine M.", content: "Absolut verdient! Beste Alarmanlage am Markt.", created_at: new Date(2024, 1, 2).toISOString(), user_id: "u2", chronik_id: "mock-2024-q1" }]
  },
  // 2023
  {
    id: "mock-2023-q4",
    year: 2023,
    title: "Erster Expert Certification Kurs",
    description: "Start des neuen Schulungsprogramms für Fachbetriebe. Intensiv-Training für höchste Sicherheitsstandards und Installationsqualität.",
    images: [{ id: "img-2023-4", publicUrl: "/chronik/2025_digital.png", caption: "Partner-Training im Thitronik Campus.", chronik_id: "mock-2023-q4", storage_path: "", sort_order: 1 }],
    video_url: null,
    sort_order: 1,
    created_at: new Date(2023, 10, 10).toISOString(),
    comments: [{ id: "c13", user_name: "Techniker-Toni", content: "Anstrengende 2 Tage, aber extrem lehrreich. Kann ich nur jedem empfehlen.", created_at: new Date(2023, 10, 11).toISOString(), user_id: "u13", chronik_id: "mock-2023-q4" }]
  },
  {
    id: "mock-2023-q3",
    year: 2023,
    title: "Grand Opening THITRONIK Campus",
    description: "Mit über 500 Gästen, Partnern und Pressevertretern feiern wir die offizielle Eröffnung unseres neuen Standorts.",
    images: [{ id: "img-2023-3", publicUrl: "/chronik/2023_grand_opening.png", caption: "Ein unvergessliches Eröffnungsevent.", chronik_id: "mock-2023-q3", storage_path: "", sort_order: 2 }],
    video_url: null,
    sort_order: 2,
    created_at: new Date(2023, 7, 1).toISOString(),
    comments: [
      { id: "c14", user_name: "Hans Albers", content: "Eine tolle Feier in einem beeindruckenden Gebäude. Danke für die Einladung!", created_at: new Date(2023, 7, 2).toISOString(), user_id: "u1", chronik_id: "mock-2023-q3" },
      { id: "c14-2", user_name: "Familie Weber", content: "Tolles Rahmenprogramm für die ganze Familie.", created_at: new Date(2023, 7, 3).toISOString(), user_id: "u144", chronik_id: "mock-2023-q3" }
    ]
  },
  {
    id: "mock-2023-q2",
    year: 2023,
    title: "Richtfest & Partner Preview",
    description: "Der Rohbau ist fertiggestellt. Erste Partner dürfen einen Blick in die zukünftigen Schulungsräume und das Testgelände werfen.",
    images: [{ id: "img-2023-2", publicUrl: "/chronik/2023_foundation.png", caption: "Richtfest am Neubau.", chronik_id: "mock-2023-q2", storage_path: "", sort_order: 3 }],
    video_url: null,
    sort_order: 3,
    created_at: new Date(2023, 4, 15).toISOString(),
    comments: [{ id: "c15", user_name: "Bau-Beobachter", content: "Eindrucksvoll, wie schnell das Gebäude wächst!", created_at: new Date(2023, 4, 16).toISOString(), user_id: "u15", chronik_id: "mock-2023-q2" }]
  },
  {
    id: "mock-2023-q1",
    year: 2023,
    title: "Grundsteinlegung Eckernförde",
    description: "Startschuss für ein neues Kapitel in der THITRONIK Geschichte. Wir legen den Grundstein für den modernsten Caravan-Security Campus Europas.",
    images: [{ id: "img-2023-1", publicUrl: "/chronik/2023_foundation.png", caption: "Der Grundstein ist gelegt.", chronik_id: "mock-2023-q1", storage_path: "", sort_order: 4 }],
    video_url: null,
    sort_order: 4,
    created_at: new Date(2023, 1, 1).toISOString(),
    comments: [
      { id: "c16", user_name: "Bürgermeister", content: "Ein Gewinn für den Wirtschaftsstandort Eckernförde.", created_at: new Date(2023, 1, 2).toISOString(), user_id: "u16", chronik_id: "mock-2023-q1" },
      { id: "c16-2", user_name: "Admin", content: "Wir sind stolz darauf, hier unsere Wurzeln zu vertiefen.", created_at: new Date(2023, 1, 3).toISOString(), user_id: "admin", chronik_id: "mock-2023-q1" }
    ]
  }
];

export async function getChronikEntries(): Promise<ChronikEntry[]> {
  // Return mock data early if in Demo Mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return MOCK_CHRONIK_ENTRIES;
  }

  try {
    const supabase = await createClient();

    const { data: entries, error } = await supabase
      .from("campus_chronik")
      .select(`
        *,
        images:campus_chronik_images(*),
        comments:campus_chronik_comments(*)
      `)
      .order("year", { ascending: false })
      .order("sort_order", { foreignTable: "campus_chronik_images", ascending: true })
      .order("created_at", { foreignTable: "campus_chronik_comments", ascending: true });

    if (error || !entries || entries.length === 0) {
      if (error) {
        console.error("Error fetching chronik entries from Supabase:", {
          message: error.message || "Unknown error",
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      }
      return MOCK_CHRONIK_ENTRIES;
    }

    // Resolve signed URLs for images
    const entriesWithSignedUrls = await Promise.all(
      entries.map(async (entry: any) => {
        const imagesWithUrls = await Promise.all(
          entry.images.map(async (image: any) => {
            try {
              const { data, error: urlError } = await supabase.storage
                .from("chronik-images")
                .createSignedUrl(image.storage_path, 3600);

              if (urlError) throw urlError;

              return {
                ...image,
                publicUrl: data?.signedUrl || null,
              };
            } catch (err) {
              console.warn(`Failed to create signed URL for image ${image.id}:`, err);
              return { ...image, publicUrl: null };
            }
          })
        );

        return {
          ...entry,
          images: imagesWithUrls,
        } as ChronikEntry;
      })
    );

    return entriesWithSignedUrls;
  } catch (err: any) {
    console.error("Unexpected error in getChronikEntries:", err);
    return MOCK_CHRONIK_ENTRIES;
  }
}

export async function addComment(chronikId: string, content: string): Promise<void> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    console.log("Demo mode: skipping comment persistence");
    revalidatePath("/chronik");
    return;
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const userName = user.user_metadata?.full_name || user.email || "Anonymous";

  const { error } = await supabase.from("campus_chronik_comments").insert({
    chronik_id: chronikId,
    user_id: user.id,
    user_name: userName,
    content,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/chronik");
}

export async function deleteComment(commentId: string): Promise<void> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    console.log("Demo mode: skipping comment deletion");
    revalidatePath("/chronik");
    return;
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("campus_chronik_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/chronik");
}

export async function uploadChronikImage(chronikId: string, formData: FormData): Promise<void> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    throw new Error("Image upload is not available in demo mode.");
  }

  const supabase = await createClient();
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file provided");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${chronikId}/${uuidv4()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("chronik-images")
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { error: insertError } = await supabase.from("campus_chronik_images").insert({
    chronik_id: chronikId,
    storage_path: fileName,
  });

  if (insertError) {
    throw insertError;
  }

  revalidatePath("/chronik");
}
