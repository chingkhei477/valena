/*
  Valena offers list.
  Add one entry per live store offer, using the tracking link from your affiliate network.
  Only list stores whose affiliate programme has approved Valena.

  Fields:
    store       Store name as the store writes it                 "Store name"
    category    One of: Fashion, Electronics, Travel, Food & Groceries, Beauty, Home, Other
    rate        Rate exactly as it should appear                  "5%", "Up to 7%", "Flat ₹150"
    summary     One line on what earns cashback
    conditions  Short list of key conditions (array of strings)
    url         Affiliate tracking link (https://...)
    newUsers    true if only first orders / new customers qualify (optional)

  Example entry (copy, then fill in with real details):
  {
    store: "",
    category: "Fashion",
    rate: "",
    summary: "",
    conditions: [""],
    url: "https://",
    newUsers: false
  }
*/
window.VALENA_OFFERS = [
];
