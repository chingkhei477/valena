VALENA WEBSITE — valena.in
===========================

This folder is the complete static website. Upload everything in it to the
root of your web hosting (Netlify, Vercel, Cloudflare Pages, GitHub Pages,
Hostinger, cPanel, etc.). No build step or server code is needed.

Pages
  index.html            Home
  offers.html           Offers (reads assets/offers.js)
  how-it-works.html     How cashback works, statuses, payouts, estimate tool, FAQ
  about.html            About Valena
  contact.html          Support email, business address, contact form
  privacy-policy.html   Privacy Policy (DPDP Act 2023)
  terms.html            Terms & Conditions
  cashback-terms.html   Cashback Terms
  refund-policy.html    Refund & Cancellation Policy
  cookie-policy.html    Cookie Policy
  404.html              Not-found page (set as the custom 404 on your host)

Also included: favicon.svg / PNG icons, og-image.png (link previews),
site.webmanifest, sitemap.xml, robots.txt.

ADDING OFFERS
  Open assets/offers.js and add one entry per store whose affiliate
  programme has approved Valena. The format is explained at the top of the
  file. Categories and filters appear automatically. Until at least one
  offer is added, the Offers page says no store offers are live.

CONTACT FORM
  The form opens the visitor's email app with a pre-filled message to
  support@valena.in, so no form service is needed. To receive messages
  without the email app step, connect a form service (e.g. Formspree,
  Netlify Forms) to the form with id "contact-form" in contact.html.

BEFORE GOING LIVE
  - Have the policy pages reviewed by a lawyer. The figures used in them
    (30-day missing-cashback window, 15-day rejection-review window, 30–90 day
    validation range) are drafting defaults you should confirm.
  - If Valena is an intermediary under the IT Rules 2021, a named
    Grievance Officer may need to be published on the Privacy Policy.
  - Member sign-in, click tracking and payouts need an account system and
    an affiliate-network integration; this static site explains the
    process but does not include that backend.
  - Set up the support@valena.in mailbox and submit sitemap.xml in
    Google Search Console.

Fonts: Bodoni Moda and Albert Sans (SIL Open Font License),
loaded from Google Fonts.
