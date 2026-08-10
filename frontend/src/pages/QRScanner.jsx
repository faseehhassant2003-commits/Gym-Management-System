import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { toast } from "react-toastify";

import { getMemberByQrToken } from "../api/memberApi";
import {
  addAttendance,
  getAttendance,
  updateAttendance,
} from "../api/AttendanceApi";

import "./QRScanner.css";

function QRScanner({
  attendanceDate,
  onClose,
  onAttendanceMarked,
}) {
  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);

  // Prevent the same QR from being processed repeatedly
  const lastScannedRef = useRef("");

  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);

  const [memberDetails, setMemberDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    let mounted = true;

    async function startScanner() {
      if (!videoRef.current) {
        return;
      }

      try {
        const controls =
          await codeReader.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result, err) => {
              if (!mounted) {
                return;
              }

              if (result) {
                const token = result.getText();

                if (
                  token &&
                  token !== lastScannedRef.current
                ) {
                  lastScannedRef.current = token;

                  setResult(token);
                  setError("");

                  fetchMemberDetails(token);
                }
              }

              if (err) {
                const message = err?.message || "";

                if (
                  !message.includes("NotFoundException") &&
                  !message.includes("ChecksumException") &&
                  !message.includes("FormatException") &&
                  !message.includes(
                    "No MultiFormat reader solutions were found"
                  )
                ) {
                  setError(message);
                }
              }
            }
          );

        scannerControlsRef.current = controls;

        if (mounted) {
          setActive(true);
        }
      } catch (err) {
        console.error(err);

        setError(
          "Unable to access camera. Please allow camera access or use a supported browser."
        );
      }
    }

    startScanner();

    return () => {
      mounted = false;

      if (scannerControlsRef.current?.stop) {
        scannerControlsRef.current.stop();
      }

      scannerControlsRef.current = null;
    };
  }, []);

  async function fetchMemberDetails(qrToken) {
    setLoadingDetails(true);

    try {
      const response =
        await getMemberByQrToken(qrToken);

      setMemberDetails(response.data);
      setError("");
    } catch (err) {
      setMemberDetails(null);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "No member found for this QR token"
      );
    } finally {
      setLoadingDetails(false);
    }
  }

  async function markAttendance() {
    if (!memberDetails) {
      return;
    }

    if (!attendanceDate) {
      toast.error(
        "Please select an attendance date."
      );
      return;
    }

    try {
      /*
       * Get existing attendance records
       */
      const response = await getAttendance();

      const attendanceList = response.data;

      /*
       * Find attendance for:
       *
       * member + selected date
       */
      const existingAttendance =
        attendanceList.find(
          (record) =>
            String(record.member.id) ===
              String(memberDetails.id) &&
            record.attendanceDate ===
              attendanceDate
        );

      const attendanceData = {
        member: {
          id: memberDetails.id,
        },
        attendanceDate: attendanceDate,
        status: "Present",
      };

      /*
       * If attendance already exists,
       * UPDATE instead of INSERT.
       */
      if (existingAttendance) {
        await updateAttendance(
          existingAttendance.id,
          attendanceData
        );

        toast.success(
          `${memberDetails.name}'s attendance updated successfully.`
        );
      } else {
        /*
         * Otherwise create new attendance.
         */
        await addAttendance(
          attendanceData
        );

        toast.success(
          `${memberDetails.name}'s attendance marked successfully.`
        );
      }

      /*
       * Refresh Attendance.jsx table
       */
      if (onAttendanceMarked) {
        await onAttendanceMarked();
      }

      /*
       * Close popup
       */
      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to mark attendance."
      );
    }
  }

  return (
    <div className="qr-scanner-modal-content">

      <div className="scanner-body">

        {/* Camera */}
        <div className="scanner-camera">

          <video
            className="scanner-preview"
            ref={videoRef}
            playsInline
            muted
            autoPlay
          />

          {!active && (
            <div className="scanner-camera-message">
              Starting camera...
            </div>
          )}

        </div>

        {/* Scanner information */}
        <div className="scanner-details">

          <div className="scanner-status">

            <span
              className={
                active
                  ? "status-dot active"
                  : "status-dot"
              }
            />

            {active
              ? "Scanning..."
              : "Starting camera..."}

          </div>

          {error && (
            <div className="scanner-error mt-2">
              {error}
            </div>
          )}

          {/* Selected attendance date */}
          <div className="scanner-date-info">
            Attendance Date:{" "}
            <strong>
              {formatDate(attendanceDate)}
            </strong>
          </div>

          {/* Scanned token */}
          {result && (
            <div className="scanner-result mb-3">

              <label>
                Scanned Token
              </label>

              <textarea
                value={result}
                readOnly
                rows={3}
                className="form-control"
              />

            </div>
          )}

          {/* Loading */}
          {loadingDetails && (
            <div className="alert alert-info">
              Loading member details...
            </div>
          )}

          {/* Member details */}
          {memberDetails &&
            !loadingDetails && (

              <div className="card mt-3">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">

                    <div>

                      <h5 className="mb-1">
                        Member Details
                      </h5>

                      <p className="mb-0 text-muted">
                        Verify the member before marking attendance.
                      </p>

                    </div>

                    <button
                      className="btn btn-success"
                      onClick={markAttendance}
                    >
                      Mark Present
                    </button>

                  </div>

                  <div className="row gy-2">

                    <div className="col-12 col-md-6">
                      <strong>Name:</strong>{" "}
                      {memberDetails.name}
                    </div>

                    <div className="col-12 col-md-6">
                      <strong>Phone:</strong>{" "}
                      {memberDetails.phone}
                    </div>

                    <div className="col-12 col-md-6">
                      <strong>Age:</strong>{" "}
                      {memberDetails.age}
                    </div>

                    <div className="col-12 col-md-6">
                      <strong>Membership:</strong>{" "}
                      {memberDetails.membership}
                    </div>

                    <div className="col-12 col-md-6">
                      <strong>Height:</strong>{" "}
                      {memberDetails.height ?? "-"}
                    </div>

                    <div className="col-12 col-md-6">
                      <strong>Weight:</strong>{" "}
                      {memberDetails.weight ?? "-"}
                    </div>

                  </div>

                </div>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}


/*
 * 2026-08-10
 *
 * becomes
 *
 * 10-08-26
 */
function formatDate(date) {
  if (!date) {
    return "";
  }

  const [year, month, day] =
    date.split("-");

  return `${day}-${month}-${year.slice(-2)}`;
}

export default QRScanner;