from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT
CARS = [
    dict(
        slug="porsche-panamera",
        name="Porsche Panamera",
        brand="Porsche",
        kind="Grand tourer",
        image="hero.jpg",
        color="Obsidian black",
        price=6850000,
        tag="THE GRAND TOURER",
        intro="The long way home looks better from here.",
        description="A four-door silhouette with a sports-car spirit. This sample listing pairs an expressive design with a cabin made for the journey, whether it’s a city evening or an open weekend.",
        features=[
            "Four-door grand touring silhouette",
            "Sculpted exterior design",
            "A spacious, driver-focused cabin",
        ],
    ),
    dict(
        slug="bmw-m3",
        name="BMW M3",
        brand="BMW",
        kind="Sedan",
        image="bmw.jpg",
        color="Alpine white",
        price=4250000,
        tag="THE EVERYDAY THRILL",
        intro="A little more character in every commute.",
        description="A performance-inspired sedan with an unmistakable stance. Explore a sample vehicle page designed to bring photography, listing details, and the next step together in one place.",
        features=[
            "Four-door sports sedan",
            "Distinctive kidney grille",
            "Performance-inspired styling",
        ],
    ),
    dict(
        slug="porsche-911",
        name="Porsche 911 Classic",
        brand="Porsche",
        kind="Coupe",
        image="porsche.jpg",
        color="Classic silver",
        price=7950000,
        tag="THE TIMELESS ONE",
        intro="Some shapes never need an introduction.",
        description="An enduring silhouette, a compact coupe, and an invitation to take the scenic route. This classic-inspired sample listing celebrates the feeling of a great drive.",
        features=[
            "Classic two-door coupe",
            "Recognizable rear-engine silhouette",
            "Timeless silver exterior",
        ],
    ),
]
SERVICES = [
    dict(
        slug="preventive-maintenance",
        name="Preventive maintenance",
        short="Keep the everyday drive feeling right.",
        num="01",
        price="₱3,500",
        duration="Half-day appointment",
        intro="Good care starts before the warning light.",
        body="A considered routine check designed to make everyday ownership feel simpler. This sample package shows how a workshop can explain its maintenance process clearly.",
        items=[
            "Oil and filter service assessment",
            "Fluid levels and visible leak inspection",
            "Battery, tire, and light checks",
            "A clear summary of recommended next steps",
        ],
    ),
    dict(
        slug="auto-detailing",
        name="Auto detailing",
        short="A fresh start, inside and out.",
        num="02",
        price="₱5,500",
        duration="Full-day appointment",
        intro="Bring back that just-cleaned feeling.",
        body="From the first impression to the details you notice every day, a careful refresh gives a car room to shine. Explore a sample detailing package for exterior and cabin care.",
        items=[
            "Exterior wash and surface preparation",
            "Paint finish assessment",
            "Interior vacuum and surface care",
            "Final walkaround and care guidance",
        ],
    ),
    dict(
        slug="diagnostics-repairs",
        name="Diagnostics & repairs",
        short="Understand the issue. Plan the fix.",
        num="03",
        price="₱1,500",
        duration="Initial assessment",
        intro="A clearer picture of what your car needs.",
        body="A sensible repair starts with understanding the concern. This demonstration service page explains the assessment stage before any work is agreed.",
        items=[
            "Discussion of symptoms and concerns",
            "Initial diagnostic scan where applicable",
            "Visual inspection of relevant systems",
            "Illustrative findings and repair estimate",
        ],
    ),
    dict(
        slug="pre-purchase-inspection",
        name="Pre-purchase inspection",
        short="Look a little closer before your next car.",
        num="04",
        price="₱2,500",
        duration="By appointment",
        intro="Get to know the car behind the listing.",
        body="A second look can make a buying conversation more useful. This sample inspection package brings the vehicle’s visible condition and basic checks into one summary.",
        items=[
            "Exterior and cabin condition overview",
            "Visible engine bay and fluid checks",
            "Tire, light, and basic equipment checks",
            "Sample inspection summary",
        ],
    ),
]


def money(v):
    return "₱" + format(v, ",")


def render(path, title, content, active=""):
    depth = len([p for p in path.split("/") if p])
    pre = "../" * depth or "./"

    def u(route=""):
        return pre + route.strip("/") + ("/" if route.strip("/") else "")

    nav = "".join(
        f'<a {"aria-current=page" if active==key else ""} href="{u(route)}">{label}</a>'
        for key, route, label in [
            ("home", "", "Home"),
            ("cars", "cars", "The collection"),
            ("services", "services", "Our services"),
            ("about", "about", "About us"),
        ]
    )
    html = f"""<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="AutoLab: a sample automotive showroom and service-center website template by Marvin Miranda. Not a real business."><title>{escape(title)} | AutoLab</title><link rel="stylesheet" href="{pre}style.css"></head><body><a class="skip" href="#main">Skip to content</a><div class="topbar"><span>AUTOMOTIVE SHOWROOM & SERVICE CENTER</span><span class="demo-label">DEMO WEBSITE / NO REAL SALES OR BOOKINGS</span></div><header><a class="logo" href="{u()}">AUTO<span>LAB</span><i>.</i></a><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">Menu ☰</button><nav aria-label="Main navigation">{nav}<a class="nav-cta" href="{u('contact')}">Let’s talk <span>↗</span></a></nav><div id="header-tools"></div></header><main id="main">{content}</main><footer><div class="footer-top wrap"><div><a class="logo" href="{u()}">AUTO<span>LAB</span><i>.</i></a><p>For the drive.<br>For everything after.</p></div><div><h3>Explore</h3><a href="{u('cars')}">The collection</a><a href="{u('services')}">Our services</a><a href="{u('about')}">Our story</a></div><div><h3>Start a conversation</h3><a href="{u('contact')}">Vehicle inquiry ↗</a><a href="{u('contact')}?type=service">Service request ↗</a><a href="{u('credits')}">Photography credits</a></div><div class="footer-note"><span class="eyebrow">A TEMPLATE BY</span><p>Marvin Miranda</p><span>Built to inspire your next business website.</span></div></div><div class="disclaimer wrap"><strong>Sample website. Real design. Fictional business.</strong><p>AutoLab is a portfolio demonstration and website template, not an operating showroom or service center. Vehicles, prices, packages, and business details are illustrative. Nothing is offered for sale. Forms do not send inquiries or create bookings. Vehicle brands and photographs belong to their respective owners; no affiliation or endorsement is implied.</p></div><div class="footer-bottom wrap"><span>© 2026 AutoLab concept · Marvin Miranda</span><span>Made for the road ahead.</span><a href="#">Back to top ↑</a></div></footer><script id="autolab-data" type="application/json">{json.dumps(dict(cars=CARS,base=pre,page=path),ensure_ascii=False).replace(chr(60),chr(92)+"u003c")}</script><div id="react-ui"></div><script defer src="{pre}assets/react.js"></script><script defer src="{pre}assets/react-dom.js"></script><script defer src="{pre}react-app.js"></script><script defer src="{pre}app.js"></script></body></html>"""
    if path == "":
        html = html.replace(
            '<section class="hero editorial-hero">',
            '<section class="hero editorial-hero" id="hero-react">',
        )
    if path == "cars":
        html = html.replace(
            '<section class="wrap listing-section">',
            '<section class="wrap listing-section" id="collection-react">',
        )
    if path.startswith("cars/"):
        slug = path.split("/")[-1]
        html = html.replace(
            '<a class="panel-link"',
            f'<div class="detail-actions" data-car-tools="{slug}"></div><a class="panel-link"',
            1,
        )
    html = html.replace("@ROOT@", pre)
    out = OUT / path / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)


def card(c):
    return f"""<article class="car-card" data-brand="{c['brand']}" data-kind="{c['kind']}" data-name="{c['name'].lower()}" data-price="{c['price']}"><a class="car-image" href="@ROOT@cars/{c['slug']}/"><img src="@ROOT@assets/{c['image']}" alt="{c['name']} — illustrative stock photograph" loading="lazy"><span class="image-tag">SAMPLE LISTING</span><span class="round-arrow">↗</span></a><div class="car-meta"><span>{c['brand'].upper()} / {c['kind'].upper()}</span><span>{c['color']}</span></div><h3><a href="@ROOT@cars/{c['slug']}/">{c['name']}</a></h3><div class="car-bottom"><span>{money(c['price'])}<small>Illustrative price</small></span><a href="@ROOT@cars/{c['slug']}/">Explore model ↗</a></div><div class="car-tools" data-car-tools="{c['slug']}"></div></article>"""


def service_rows():
    return "".join(
        f"""<a class="service-row" href="@ROOT@services/{s['slug']}/"><span>{s['num']}</span><div><h3>{s['name']}</h3><p>{s['short']}</p></div><span class="service-price">From {s['price']}<small>Sample package</small></span><b>↗</b></a>"""
        for s in SERVICES
    )


def crumbs(label, parent=None):
    return (
        f'<div class="crumb wrap"><a href="@ROOT@">Home</a> / '
        + (f'<a href="@ROOT@{parent.lower()}/">{parent}</a> / ' if parent else "")
        + label
        + "</div>"
    )


cta = """<section class="cta wrap"><div><span class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>A new drive.<br>A <em>good conversation.</em></h2></div><a class="button orange" href="@ROOT@contact/">Explore the inquiry demo ↗</a></section>"""
home = (
    """<section class="hero editorial-hero"><div class="hero-orbit" aria-hidden="true"></div><div class="hero-topline"><span class="eyebrow">THE DRIVE IS PERSONAL.</span><span class="hero-edition">AUTOLAB / COLLECTION 01</span></div><div class="hero-story"><h1>GOOD CARS.<br>GREAT <em>INSTINCTS.</em></h1><p>Find the car that feels like you.<br>Stay for everything that keeps it that way.</p><a class="hero-explore" href="@ROOT@cars/">Explore the collection <span>↗</span></a></div><div class="car-stage"><img class="stage-image" src="@ROOT@assets/bmw.jpg" alt="White BMW M3 in a three-quarter front view" fetchpriority="high"></div><div class="hero-dial"><span>03</span><small>MODELS.<br>DIFFERENT CHARACTERS.</small></div><div class="hero-wordmark" aria-hidden="true">BMW<span>M3 / 01</span></div><a class="hero-model-card" href="@ROOT@cars/bmw-m3/"><span class="eyebrow">IN FOCUS</span><img src="@ROOT@assets/bmw.jpg" alt="White BMW M3 sample listing"><strong>BMW M3 <span>↗</span></strong><small>Alpine white / Sample vehicle</small></a><div class="hero-bottomline"><div class="model-chips"><a class="selected" href="@ROOT@cars/bmw-m3/">BMW M3 ↗</a><a href="@ROOT@cars/porsche-panamera/">Porsche Panamera ↗</a><a href="@ROOT@cars/porsche-911/">Porsche 911 ↗</a></div><a class="hero-service-link" href="@ROOT@services/">DISCOVER THE SERVICE CENTER <span>↓</span></a></div></section><div class="brandline wrap"><span>A COLLECTION WITH CHARACTER</span><span>PORSCHE</span><span>BMW</span><span class="last-brand">BUILT AROUND THE DRIVE.</span></div><section class="section wrap"><div class="section-heading"><div><span class="eyebrow">01 / THE COLLECTION</span><h2>DISTINCT DRIVES.<br><em>ONE COLLECTION.</em></h2></div><div><p>From an everyday favorite to a weekend escape.<br>Explore a small collection with a little personality.</p><a class="underlink" href="@ROOT@cars/">View the full collection ↗</a></div></div><div class="car-grid">"""
    + "".join(card(c) for c in CARS)
    + """</div></section><section class="care"><div class="care-photo"><img src="@ROOT@assets/workshop.jpg" alt="Mechanic working beneath a car in a workshop" loading="lazy"><span>GOOD CARE GOES A LONG WAY.</span></div><div class="care-content"><span class="eyebrow">02 / THE SERVICE CENTER</span><h2>BEYOND<br><em>THE SHOWROOM.</em></h2><p>A great drive doesn’t end at the showroom. Explore maintenance, detailing, and diagnostic services designed around the everyday life of a car.</p>"""
    + service_rows()
    + """<p class="fine">All packages and prices shown are examples for this template.</p></div></section><section class="section wrap ownership"><span class="eyebrow">03 / A BETTER WAY TO EXPLORE</span><h2>YOUR NEXT CHAPTER.<br><em>THREE SIMPLE STEPS.</em></h2><div class="steps"><div><span>01</span><h3>Find your kind of drive.</h3><p>Browse the collection, compare sample listings, and get a feel for each model.</p></div><div><span>02</span><h3>Get the details.</h3><p>Open a dedicated model page for photos, highlights, and illustrative listing information.</p></div><div><span>03</span><h3>Start a conversation.</h3><p>Try the inquiry flow and see how a real automotive business could welcome its next customer.</p></div></div></section>"""
    + cta
)
render("", "Cars with character. Care with purpose.", home, "home")
collection = (
    crumbs("The collection")
    + """<section class="page-intro wrap"><span class="eyebrow">THE AUTOLAB COLLECTION</span><h1>A drive for<br><em>your kind of day.</em></h1><p>Explore our sample showroom. Every listing has its own story—and its own page.</p></section><section class="wrap listing-section"><form class="filters" id="filters"><label>Find a model<input type="search" id="search" placeholder="Search Porsche, BMW…"></label><label>Brand<select id="brand"><option value="">All brands</option><option>BMW</option><option>Porsche</option></select></label><label>Body style<select id="kind"><option value="">All body styles</option><option>Sedan</option><option>Coupe</option><option>Grand tourer</option></select></label><label>Sort by<select id="sort"><option value="default">Featured</option><option value="asc">Price: low to high</option><option value="desc">Price: high to low</option></select></label><button type="reset" class="reset">Reset ↺</button></form><div class="results-line"><span id="result-count" aria-live="polite">3 sample vehicles</span><span>Illustrative inventory · not for sale</span></div><div class="car-grid" id="car-results">"""
    + "".join(card(c) for c in CARS)
    + """</div><div id="empty" hidden><h2>No matches just yet.</h2><p>Try another model name or reset the filters.</p></div></section>"""
    + cta
)
render("cars", "The collection", collection, "cars")
for c in CARS:
    other = "".join(card(x) for x in CARS if x != c)
    body = (
        crumbs(c["name"], "Cars")
        + f"""<section class="model-intro wrap"><div><span class="eyebrow">{c['tag']}</span><h1>{c['name']}</h1><p>{c['intro']}</p></div><div class="model-price">{money(c['price'])}<small>Illustrative price · no vehicle for sale</small></div></section><section class="wrap model-photo"><img src="@ROOT@assets/{c['image']}" alt="{c['name']} stock photograph"><span>REFERENCE PHOTO / ACTUAL VEHICLE DETAILS MAY DIFFER</span></section><section class="wrap detail-grid"><div><span class="eyebrow">A CLOSER LOOK</span><h2>A little more<br><em>about the drive.</em></h2><p>{c['description']}</p><h3>Design highlights</h3><ul class="check-list">{''.join('<li>'+x+'</li>' for x in c['features'])}</ul><p class="fine">Photographs illustrate the model family. This is a fictional listing, not a verified vehicle specification or an offer.</p><details><summary>What should a real vehicle listing include?</summary><p>A real seller should verify the exact model year, trim, mileage, ownership history, condition, service records, and price before publishing.</p></details><details><summary>Can I buy or test-drive this car?</summary><p>No. AutoLab is a sample website. The inquiry form is a local demonstration and does not contact a dealership.</p></details></div><aside class="info-panel"><span class="eyebrow">SAMPLE VEHICLE OVERVIEW</span><dl><dt>Brand</dt><dd>{c['brand']}</dd><dt>Model</dt><dd>{c['name']}</dd><dt>Body style</dt><dd>{c['kind']}</dd><dt>Display color</dt><dd>{c['color']}</dd><dt>Availability</dt><dd>Demo only</dd></dl><a class="button orange" href="@ROOT@contact/?vehicle={c['slug']}">Try a vehicle inquiry ↗</a><a class="panel-link" href="@ROOT@cars/">← Back to the collection</a></aside></section><section class="wrap section related"><span class="eyebrow">KEEP EXPLORING</span><h2>Another kind <em>of drive.</em></h2><div class="car-grid two">{other}</div></section>"""
    )
    render("cars/" + c["slug"], c["name"], body, "cars")
services = (
    crumbs("Our services")
    + """<section class="page-intro wrap"><span class="eyebrow">THE AUTOLAB SERVICE CENTER</span><h1>Look after<br><em>the long run.</em></h1><p>From a routine refresh to a closer inspection, explore the care behind a better drive.</p></section><div class="wrap service-banner"><img src="@ROOT@assets/workshop.jpg" alt="Mechanic working in a real automotive workshop"><span>EVERY DETAIL HAS A PURPOSE.</span></div><section class="wrap section service-page"><div class="section-heading"><div><span class="eyebrow">CHOOSE YOUR CARE</span><h2>Good care.<br><em>Clearly explained.</em></h2></div><p>Open a service to explore the sample package.<br>All prices are illustrative, not quotations.</p></div>"""
    + service_rows()
    + """</section><section class="wrap faq"><h2>A few things <em>to know.</em></h2><details><summary>Are parts included in the sample prices?</summary><p>These are placeholder prices. A real workshop would explain labor, parts, taxes, and exclusions in its quotation.</p></details><details><summary>Can I book a real appointment?</summary><p>No. You can try the booking form, but no information is sent and no appointment is created.</p></details></section>"""
    + cta
)
render("services", "Our services", services, "services")
for s in SERVICES:
    body = (
        crumbs(s["name"], "Services")
        + f"""<section class="page-intro wrap"><span class="eyebrow">SERVICE {s['num']} / CARE WITH PURPOSE</span><h1>{s['name']}</h1><p>{s['intro']}</p></section><section class="wrap detail-grid service-detail"><div><img class="service-detail-photo" src="@ROOT@assets/workshop.jpg" alt="Automotive workshop reference photograph"><h2>It’s in <em>the details.</em></h2><p>{s['body']}</p><h3>What this sample package covers</h3><ul class="check-list">{''.join('<li>'+x+'</li>' for x in s['items'])}</ul><h3>How a visit could work</h3><p>Share the concern, discuss the assessment, then review the recommended work and estimate before proceeding. This is an illustrative service flow.</p></div><aside class="info-panel"><span class="eyebrow">SAMPLE PACKAGE</span><h2>From {s['price']}</h2><p class="fine">Illustrative starting price. Not a real quotation.</p><dl><dt>Appointment</dt><dd>{s['duration']}</dd><dt>Final cost</dt><dd>Vehicle-dependent</dd><dt>Availability</dt><dd>Demo only</dd></dl><a class="button orange" href="@ROOT@contact/?service={s['slug']}&type=service">Try a service request ↗</a><a class="panel-link" href="@ROOT@services/">← Explore all services</a></aside></section>"""
        + cta
    )
    render("services/" + s["slug"], s["name"], body, "services")
about = (
    crumbs("About us")
    + """<section class="page-intro wrap"><span class="eyebrow">THE IDEA BEHIND AUTOLAB</span><h1>For people<br><em>who love the drive.</em></h1><p>A showroom concept built around character, clarity, and the life of a car.</p></section><section class="wrap about-grid"><img src="@ROOT@assets/porsche.jpg" alt="Classic Porsche parked on a leafy street"><div><span class="eyebrow">A BUSINESS WEBSITE CONCEPT</span><h2>A place for cars.<br><em>And their next chapter.</em></h2><p>AutoLab imagines a modern automotive business where discovering a car and looking after it belong in the same experience.</p><p>The collection brings model photography and dedicated vehicle pages together. The service center gives maintenance, detailing, and inspections their own space, with practical next steps.</p><p>Created by Marvin Miranda as a portfolio project and reusable website template. AutoLab is fictional; the design demonstrates how a real showroom or workshop could present its business online.</p><a class="underlink" href="@ROOT@cars/">Take a look around ↗</a></div></section><section class="wrap section"><span class="eyebrow">WHAT SHAPES THE EXPERIENCE</span><div class="steps"><div><span>01</span><h3>Character over clutter.</h3><p>Real photography and space for each model to speak for itself.</p></div><div><span>02</span><h3>Details that make sense.</h3><p>Clear listing information and service descriptions, with dedicated pages to explore.</p></div><div><span>03</span><h3>An easy next step.</h3><p>A simple inquiry flow that demonstrates how to start a customer conversation.</p></div></div></section>"""
    + cta
)
render("about", "Our story", about, "about")
options = "".join(
    f'<option value="{c["slug"]}">{c["name"]}</option>' for c in CARS
) + "".join(f'<option value="{s["slug"]}">{s["name"]}</option>' for s in SERVICES)
contact = (
    crumbs("Contact")
    + """<section class="page-intro wrap"><span class="eyebrow">LET’S START HERE</span><h1>Your next drive.<br><em>Let’s talk about it.</em></h1><p>Try the sample inquiry form for a vehicle or service.</p></section><section class="wrap contact-grid"><div><span class="eyebrow">THE INQUIRY EXPERIENCE</span><h2>A simple<br><em>first hello.</em></h2><p>Choose a model or a service, add your preferred date, and preview the next step.</p><div class="demo-box"><strong>This is a demonstration.</strong><p>No information is sent or saved. No bookings, sales, or follow-up messages are created. Use sample details to try the form.</p></div><div class="contact-note"><span>SHOWROOM & WORKSHOP</span><p>Fictional business · Philippines-inspired concept<br>No physical location or operating hours.</p></div></div><form id="inquiry-form"><div class="form-pair"><label>Your name<input name="name" autocomplete="off" required placeholder="e.g. Alex Santos" maxlength="100"></label><label>Email address<input type="email" name="email" autocomplete="off" required placeholder="e.g. alex@example.com"></label></div><div class="form-pair"><label>I’m interested in<select name="type"><option value="vehicle">A vehicle inquiry</option><option value="service">A service appointment</option><option value="general">A general question</option></select></label><label>Choose a model or service<select name="interest"><option value="">Select an option</option>"""
    + options
    + """</select></label></div><label>Preferred date <small>(optional)</small><input type="date" name="date"></label><label>Your message<textarea name="message" rows="4" maxlength="1500" placeholder="What would you like to know?"></textarea></label><label class="checkbox"><input type="checkbox" required><span>I understand this is a demo and no request will be sent.</span></label><button class="button orange" type="submit">Preview inquiry ↗</button><p class="fine">Demo only. Your entries stay on this page and clear when you leave or reload.</p><div id="form-result" role="status" tabindex="-1" hidden></div></form></section>"""
)
render("contact", "Start a conversation", contact)
credits = (
    crumbs("Photography credits")
    + """<section class="page-intro wrap"><span class="eyebrow">THE PEOPLE BEHIND THE PHOTOGRAPHS</span><h1>Real photos.<br><em>Proper credit.</em></h1><p>Stock photography illustrates this fictional business and its sample listings. Images are cropped for layout; no dealership affiliation is implied.</p></section><section class="wrap section credits"><h2>Photo sources</h2><p>BMW photograph — Carter Brink / Unsplash. <a href="https://unsplash.com/photos/3zfcwa3x2Kc">Original photograph ↗</a></p><p>Classic Porsche — Magnus Olin / Unsplash. <a href="https://unsplash.com/photos/cGMKMXSGDd0">Original photograph ↗</a></p><p>Workshop — Jimmy Nilsson Masth / Unsplash. <a href="https://unsplash.com/photos/jL9zfzTVSwY">Original photograph ↗</a></p><p>Panamera road photograph — Campbell / Unsplash. <a href="https://unsplash.com/photos/3ZUsNJhi_Ik">Original photograph ↗</a></p><p>New photographs are provided under the <a href="https://unsplash.com/license">Unsplash License</a>. Fonts: Barlow Condensed and Outfit, bundled locally under the SIL Open Font License.</p></section>"""
)
render("credits", "Photography credits", credits)
print("Generated", len(list(OUT.rglob("index.html"))), "pages")
