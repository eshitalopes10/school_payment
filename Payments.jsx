import { useEffect, useState } from "react";
import "./Payments.css";

export default function Payments({ token, onLogout }) {
  const [payments, setPayments] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);

  const fetchPayments = async () => {
    const res = await fetch("http://localhost:5000/api/payments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPayments(data);
  };

  const handleShowReceipt = (payment) => {
    setCurrentPayment(payment);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setCurrentPayment(null);
    setShowReceipt(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="payments-container-wrapper">
      <div className="payments-card">
        <h2>Payments Dashboard</h2>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>

        {/* Payment Table */}
        <div className="payments-table">
          <div className="table-header">
            <div>Name</div>
            <div>School ID</div>
            <div>Gateway</div>
            <div>Amount</div>
            <div>Transaction Amt</div>
            <div>Status</div>
            <div>Date & Time</div>
            <div>Receipt</div>
          </div>

          {payments.map((p) => {
            // For demo, assign random values if not present
            const schoolId = p.schoolId || "SCH123";
            const gateway = p.gateway || "Razorpay";
            const transactionAmt = p.transactionAmt || p.amount;
            const status = p.status || ["Success", "Pending", "Failed"][Math.floor(Math.random() * 3)];
            const dateTime = new Date(p.date).toLocaleString();

            return (
              <div className="table-row" key={p._id}>
                <div>{p.studentName}</div>
                <div>{schoolId}</div>
                <div>{gateway}</div>
                <div>${p.amount}</div>
                <div>${transactionAmt}</div>
                <div>
                  <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
                </div>
                <div>{dateTime}</div>
                <div>
                  <button className="receipt-btn" onClick={() => handleShowReceipt(p)}>
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Receipt Modal */}
        {showReceipt && currentPayment && (
          <div className="modal-overlay" onClick={handleCloseReceipt}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Payment Receipt</h3>
              <p><strong>Student:</strong> {currentPayment.studentName}</p>
              <p><strong>Amount:</strong> ${currentPayment.amount}</p>
              <p><strong>Date:</strong> {new Date(currentPayment.date).toLocaleString()}</p>
              <button className="close-btn" onClick={handleCloseReceipt}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
