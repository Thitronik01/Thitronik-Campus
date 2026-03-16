export const legalContent = {
    contact: {
        title: 'Kontakt',
        intro: 'Sie haben Fragen zu THITRONIK oder benötigen Unterstützung? Hier finden Sie die wichtigsten Kontaktmöglichkeiten.',
        lastUpdated: '2026-03-07',
        sections: [
            {
                id: 'address',
                title: 'Unternehmensanschrift',
                content: `THITRONIK GmbH\nFinkenweg 9–15\n24340 Eckernförde`,
            },
            {
                id: 'contact',
                title: 'Kontaktmöglichkeiten',
                content: `E-Mail: kontakt@thitronik.de\nTelefon Zentrale: +49 4351 76744-0\nTelefon Support: +49 4351 76744-112`,
                links: [
                    { label: 'kontakt@thitronik.de', href: 'mailto:kontakt@thitronik.de' },
                    { label: '+49 4351 76744-0', href: 'tel:+494351767440' },
                    { label: '+49 4351 76744-112', href: 'tel:+49435176744112' }
                ]
            },
            {
                id: 'notice',
                title: 'Hinweis',
                content: `Servicetermine sind nur nach vorheriger telefonischer Vereinbarung möglich.`,
            },
            {
                id: 'support',
                title: 'Support',
                content: `Bei technischen Fragen oder bei Fragen zur Nutzung der App wenden Sie sich bitte an den Support oder an die allgemeine Kontaktadresse.`,
            }
        ],
        footerNotice: 'Weitere rechtliche Informationen finden Sie im Impressum und in der Datenschutzerklärung.'
    },
    imprint: {
        title: 'Impressum',
        lastUpdated: '2026-03-07',
        sections: [
            {
                id: 'tmg',
                title: 'Angaben gemäß § 5 TMG',
                content: `THITRONIK GmbH\nvertreten durch den Geschäftsführer Mark Thietje\nFinkenweg 9–15\n24340 Eckernförde`
            },
            {
                id: 'contact',
                title: 'Kontakt',
                content: `E-Mail: kontakt@thitronik.de\nTelefon Zentrale: +49 4351 76744-0\nTelefon Support: +49 4351 76744-112`,
                links: [
                    { label: 'kontakt@thitronik.de', href: 'mailto:kontakt@thitronik.de' },
                    { label: '+49 4351 76744-0', href: 'tel:+494351767440' },
                    { label: '+49 4351 76744-112', href: 'tel:+49435176744112' }
                ]
            },
            {
                id: 'register',
                title: 'Handelsregister',
                content: `Eingetragen im Handelsregister des Amtsgerichts Kiel\nHandelsregisternummer: HRB 11453 KI`
            },
            {
                id: 'vat',
                title: 'Umsatzsteuer-ID',
                content: `Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:\nDE268454642`
            },
            {
                id: 'weee',
                title: 'WEEE-Registrierung',
                content: `WEEE-Reg.-Nr.:\nDE33826840`
            },
            {
                id: 'service',
                title: 'Hinweis zu Serviceterminen',
                content: `Servicetermine sind nur nach vorheriger telefonischer Vereinbarung möglich.`
            },
            {
                id: 'disclaimer',
                title: 'Rechtlicher Hinweis',
                content: `Die Inhalte dieser App wurden mit größtmöglicher Sorgfalt erstellt. Eine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird jedoch nicht übernommen.`
            },
            {
                id: 'copyright',
                title: 'Urheberrecht',
                content: `Die in dieser App veröffentlichten Inhalte unterliegen dem deutschen Urheberrecht. Jede nicht ausdrücklich gesetzlich zugelassene Verwertung bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.`
            }
        ]
    },
    privacy: {
        title: 'Datenschutz',
        intro: 'Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir über die Verarbeitung personenbezogener Daten im Zusammenhang mit der Nutzung der Campus 2.0 App.',
        toc: true,
        lastUpdated: '2026-03-07',
        internalNote: 'Datenschutzhinweise vor Release rechtlich prüfen.',
        sections: [
            {
                id: 'controller',
                title: '1. Verantwortliche Stelle',
                content: `THITRONIK GmbH\nvertreten durch den Geschäftsführer Mark Thietje\nFinkenweg 9–15\n24340 Eckernförde\nTelefon: +49 4351 76744-0\nE-Mail: kontakt@thitronik.de`,
                links: [
                    { label: 'kontakt@thitronik.de', href: 'mailto:kontakt@thitronik.de' },
                    { label: '+49 4351 76744-0', href: 'tel:+494351767440' }
                ]
            },
            {
                id: 'dpo',
                title: '2. Datenschutzkontakt',
                content: `Datenschutzbeauftragter:\nDipl.-Ing. Karsten Dreyer\nE-Mail: datenschutz@thitronik.de`,
                links: [
                    { label: 'datenschutz@thitronik.de', href: 'mailto:datenschutz@thitronik.de' }
                ]
            },
            {
                id: 'purpose',
                title: '3. Zweck der App',
                content: `Die Campus 2.0 App dient der Bereitstellung von Funktionen rund um die Nutzung von THITRONIK-bezogenen Diensten und Informationen.`
            },
            {
                id: 'data',
                title: '4. Verarbeitete Daten',
                content: `[PRÜFBLOCK]\n- Registrierungsdaten\n- Kontaktdaten\n- Geräte- und App-Informationen\n- Nutzungsdaten\n- Supportanfragen\n- Diagnosedaten\n- Push-Token\n- Standortdaten, falls relevant`
            },
            {
                id: 'anonymous',
                title: '5. Anonymisierte Nutzungsdaten',
                content: `Nach Angaben von THITRONIK werden Benutzungsdaten der Thitronik App vollständig anonymisiert erfasst, gespeichert und ausgewertet, sodass kein Rückschluss auf individuelle Nutzer möglich ist.`
            },
            {
                id: 'basis',
                title: '6. Rechtsgrundlagen der Verarbeitung',
                content: `- Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung bzw. Durchführung vorvertraglicher Maßnahmen\n- Art. 6 Abs. 1 lit. c DSGVO bei gesetzlichen Pflichten\n- Art. 6 Abs. 1 lit. f DSGVO bei berechtigten Interessen\n- Art. 6 Abs. 1 lit. a DSGVO bei Einwilligungen`
            },
            {
                id: 'recipients',
                title: '7. Empfänger von Daten',
                content: `[PRÜFBLOCK]\n- interne Stellen\n- IT-Dienstleister\n- Hosting-/Backend-Dienstleister\n- Support-Dienstleister\n- Analytik-/Crash-Reporting-Dienstleister\n- Behörden, soweit gesetzlich erforderlich`
            },
            {
                id: 'duration',
                title: '8. Speicherdauer',
                content: `Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.`
            },
            {
                id: 'rights',
                title: '9. Ihre Rechte',
                content: `Nutzer haben nach Maßgabe der gesetzlichen Vorschriften insbesondere folgende Rechte:\n- Auskunft\n- Berichtigung\n- Löschung\n- Einschränkung der Verarbeitung\n- Datenübertragbarkeit\n- Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft\n- Beschwerde bei einer zuständigen Datenschutzaufsichtsbehörde`
            },
            {
                id: 'contact_privacy',
                title: '10. Kontakt bei Datenschutzanfragen',
                content: `Bei Fragen zur Verarbeitung personenbezogener Daten oder zur Geltendmachung Ihrer Rechte können Sie sich an kontakt@thitronik.de oder an datenschutz@thitronik.de wenden.`,
                links: [
                    { label: 'kontakt@thitronik.de', href: 'mailto:kontakt@thitronik.de' },
                    { label: 'datenschutz@thitronik.de', href: 'mailto:datenschutz@thitronik.de' }
                ]
            }
        ]
    }
};
