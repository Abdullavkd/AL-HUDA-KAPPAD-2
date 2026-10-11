export default function TrustIntro() {
  const bankDetails = [
    ["Account name", "AL HUDA ISLAMIC CULTURAL ESTABLISHMENT AND AINUL HUDA ORPHANAGE"],
    ["Account Number", "0160073000000101"],
    ["IFSC code", "SIBL0000160"],
    ["Bank name", "The South Indian Bank Ltd."],
    ["Branch", "Chemanchery"]
  ];

  async function copyDetail(value) {
    try {
      await navigator.clipboard.writeText(value);
      window.alert("Copied to clipboard");
    } catch {
      window.alert("Please copy the detail manually.");
    }
  }

  return (
    <section className="donation-home" id="donation-details">
      <div className="donation-home__heading">
        <span className="donation-home__eyebrow">SUPPORT OUR MISSION</span>
        <h2>Make a Difference Through Your Donation</h2>
        <p>Your support helps Ainul Huda Orphanage Kappad provide care, education, and a brighter future.</p>
      </div>

      <div className="donation-home__grid">
        <div className="donation-home__bank">
          <h3>Bank Transfer Details</h3>
          {bankDetails.map(([label, value]) => (
            <div className="donation-home__row" key={label}>
              <div className="donation-home__detail">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
              <button
                type="button"
                onClick={() => copyDetail(value)}
                aria-label={`Copy ${label}`}
              >
                Copy
              </button>
            </div>
          ))}
        </div>

        <div className="donation-home__qr-card">
          <h3>Scan to Donate</h3>
          <p>Scan with your payment app and verify the recipient name before paying.</p>
          <img
            src="/donation-qr.png"
            alt="Donation QR code"
          />
          <small>Always verify the recipient and payment details before confirming a transaction.</small>
        </div>
      </div>
    </section>
  );
}