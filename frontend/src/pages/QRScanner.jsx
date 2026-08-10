import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import "./QRScanner.css";

function QRScanner() {
  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    async function startScanner() {
      if (!videoRef.current) {
        return;
      }
      try {
        const controls = await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
          if (!mounted) {
            return;
          }
          if (result) {
            setResult(result.getText());
            setError("");
          }
          if (err) {
            const message = err?.message || "Unable to decode QR code";
            if (
              !message.includes("NotFoundException") &&
              !message.includes("ChecksumException") &&
              !message.includes("FormatException") &&
              !message.includes("No MultiFormat reader solutions were found")
            ) {
              setError(message);
            }
          }
        });

        scannerControlsRef.current = controls;

        if (mounted) {
          setActive(true);
        }
      } catch (err) {
        setError("Unable to access camera. Please allow camera access or use a supported browser.");
      }
    }

    startScanner();

    return () => {
      mounted = false;
      if (scannerControlsRef.current?.stop) {
        scannerControlsRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="scanner-page container mt-5">
      <div className="scanner-card">
        <div className="scanner-header">
          <div>
            <h2>QR Scanner</h2>
            <p className="scanner-description">Use your camera to scan a member QR token.</p>
          </div>
        </div>

        <div className="scanner-body">
          <video className="scanner-preview" ref={videoRef} playsInline muted autoPlay />
          <div className="scanner-details">
            <div className="scanner-status">
              <span className={active ? "status-dot active" : "status-dot"} />
              {active ? "Scanning..." : "Starting camera..."}
            </div>
            {error && <div className="scanner-error">{error}</div>}
            <div className="scanner-result">
              <label>Scanned Token</label>
              <textarea value={result} readOnly rows={4} className="form-control" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;
