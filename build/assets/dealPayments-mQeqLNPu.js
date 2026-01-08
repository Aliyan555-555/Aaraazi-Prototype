import{au as m,Z as y,bL as f}from"./index-hZmLyELT.js";const D="estatemanager_receipt_counter",v="estatemanager_receipts_metadata";function w(){const i=localStorage.getItem(v);return i?JSON.parse(i):[]}function $(i){const a=w(),o=a.findIndex(e=>e.paymentId===i.paymentId);o>=0?a[o]=i:a.push(i),localStorage.setItem(v,JSON.stringify(a))}function A(){const i=new Date().getFullYear(),a=`${D}_${i}`,e=parseInt(localStorage.getItem(a)||"0",10)+1;localStorage.setItem(a,e.toString());const t=e.toString().padStart(3,"0");return`RCP-${i}-${t}`}function b(i,a,o){const e=A(),t={receiptNumber:e,paymentId:i.id,dealId:a.id,generatedAt:new Date().toISOString(),generatedBy:o,version:1};return $(t),e}function h(i){return w().find(o=>o.paymentId===i)||null}function T(i){const a=typeof i=="string"?i:i.id;return h(a)!==null}function S(i){const a=h(i);if(!a)return null;const o=m(a.dealId);if(!o)return null;const e=o.financial.payments.find(r=>r.id===i);if(!e)return null;const t=o.cycles.sellCycle?`Property ID: ${o.cycles.sellCycle.propertyId}`:"Property information unavailable";return`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${a.receiptNumber}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #030213;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .receipt-container {
          border: 3px solid #030213;
          border-radius: 12px;
          padding: 40px;
          background: white;
        }
        
        .receipt-header {
          text-align: center;
          border-bottom: 2px solid #030213;
          padding-bottom: 25px;
          margin-bottom: 35px;
        }
        
        .company-name {
          font-size: 28pt;
          font-weight: 500;
          color: #030213;
          margin-bottom: 5px;
        }
        
        .company-tagline {
          font-size: 11pt;
          color: #666;
          margin-bottom: 15px;
        }
        
        .receipt-title {
          font-size: 32pt;
          font-weight: 500;
          color: #030213;
          margin: 15px 0 10px 0;
          letter-spacing: 2px;
        }
        
        .receipt-number {
          font-size: 16pt;
          color: #666;
          font-weight: 500;
          letter-spacing: 1px;
        }
        
        .amount-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 3px solid #030213;
          border-radius: 12px;
          padding: 35px;
          text-align: center;
          margin: 35px 0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .amount-label {
          font-size: 13pt;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
          font-weight: 500;
        }
        
        .amount-value {
          font-size: 42pt;
          font-weight: 500;
          color: #22c55e;
          letter-spacing: 1px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .amount-words {
          font-size: 11pt;
          color: #666;
          margin-top: 10px;
          font-style: italic;
        }
        
        .details-section {
          margin: 30px 0;
        }
        
        .section-title {
          font-size: 13pt;
          font-weight: 500;
          color: #030213;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .detail-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #f1f3f5;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          flex: 0 0 180px;
          font-weight: 500;
          color: #495057;
        }
        
        .detail-value {
          flex: 1;
          color: #212529;
        }
        
        .payment-type-badge {
          display: inline-block;
          background: #dcfce7;
          color: #15803d;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 10pt;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .notes-section {
          background: #fff9e6;
          border-left: 4px solid #fbbf24;
          padding: 15px 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        
        .notes-title {
          font-weight: 500;
          color: #92400e;
          margin-bottom: 5px;
        }
        
        .notes-content {
          color: #78350f;
          font-size: 10pt;
        }
        
        .signature-section {
          margin-top: 60px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 50px;
        }
        
        .signature-box {
          text-align: center;
        }
        
        .signature-line {
          border-top: 2px solid #030213;
          padding-top: 12px;
          margin-top: 60px;
        }
        
        .signature-label {
          font-weight: 500;
          color: #030213;
          margin-bottom: 5px;
        }
        
        .signature-name {
          font-size: 10pt;
          color: #666;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 25px;
          border-top: 2px solid #e9ecef;
          text-align: center;
        }
        
        .footer-text {
          font-size: 9pt;
          color: #868e96;
          line-height: 1.8;
        }
        
        .footer-important {
          font-size: 10pt;
          color: #495057;
          font-weight: 500;
          margin-bottom: 10px;
        }
        
        .version-watermark {
          position: fixed;
          bottom: 15mm;
          right: 15mm;
          font-size: 8pt;
          color: #dee2e6;
          text-align: right;
          line-height: 1.4;
        }
        
        .stamp-box {
          border: 2px dashed #ced4da;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          color: #adb5bd;
          font-size: 10pt;
          margin-top: 30px;
        }
        
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <!-- Header -->
        <div class="receipt-header">
          <div class="company-name">AARAAZI</div>
          <div class="company-tagline">Professional Real Estate Management</div>
          <div class="receipt-title">PAYMENT RECEIPT</div>
          <div class="receipt-number">${a.receiptNumber}</div>
          ${a.version>1?`<div style="font-size: 9pt; color: #e74c3c; margin-top: 5px;">DUPLICATE COPY - Version ${a.version}</div>`:""}
        </div>
        
        <!-- Amount Section -->
        <div class="amount-section">
          <div class="amount-label">Amount Received</div>
          <div class="amount-value">${y(e.amount)}</div>
          <div class="amount-words">${E(e.amount)} Rupees Only</div>
        </div>
        
        <!-- Payment Details -->
        <div class="details-section">
          <div class="section-title">Payment Information</div>
          <div class="detail-row">
            <div class="detail-label">Date of Payment:</div>
            <div class="detail-value">${new Date(e.paidDate).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Payment Type:</div>
            <div class="detail-value">
              <span class="payment-type-badge">${e.type.replace("-"," ")}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Payment Method:</div>
            <div class="detail-value" style="text-transform: capitalize;">${e.paymentMethod.replace("-"," ")}</div>
          </div>
          ${e.referenceNumber?`
          <div class="detail-row">
            <div class="detail-label">Reference Number:</div>
            <div class="detail-value">${e.referenceNumber}</div>
          </div>
          `:""}
          <div class="detail-row">
            <div class="detail-label">Payment Status:</div>
            <div class="detail-value" style="text-transform: capitalize; color: #22c55e; font-weight: 500;">${e.status}</div>
          </div>
        </div>
        
        <!-- Transaction Details -->
        <div class="details-section">
          <div class="section-title">Transaction Details</div>
          <div class="detail-row">
            <div class="detail-label">Deal Number:</div>
            <div class="detail-value">${o.dealNumber}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Property:</div>
            <div class="detail-value">${t}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Total Agreed Price:</div>
            <div class="detail-value">${y(o.financial.agreedPrice)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Total Paid to Date:</div>
            <div class="detail-value" style="color: #22c55e; font-weight: 500;">${y(o.financial.totalPaid)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Balance Remaining:</div>
            <div class="detail-value" style="color: #f97316; font-weight: 500;">${y(o.financial.balanceRemaining)}</div>
          </div>
        </div>
        
        <!-- Parties -->
        <div class="details-section">
          <div class="section-title">Parties Involved</div>
          <div class="detail-row">
            <div class="detail-label">Received From:</div>
            <div class="detail-value">
              <strong>${o.parties.buyer.name}</strong><br>
              ${o.parties.buyer.contact?`<span style="font-size: 10pt; color: #666;">${o.parties.buyer.contact}</span>`:""}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Received By:</div>
            <div class="detail-value">
              <strong>${o.agents.primary.name}</strong> (Primary Agent)<br>
              <span style="font-size: 10pt; color: #666;">On behalf of ${o.parties.seller.name}</span>
            </div>
          </div>
          ${o.agents.secondary?`
          <div class="detail-row">
            <div class="detail-label">Buyer's Agent:</div>
            <div class="detail-value"><strong>${o.agents.secondary.name}</strong> (Secondary Agent)</div>
          </div>
          `:""}
        </div>
        
        <!-- Notes -->
        ${e.notes?`
        <div class="notes-section">
          <div class="notes-title">Payment Notes:</div>
          <div class="notes-content">${e.notes}</div>
        </div>
        `:""}
        
        <!-- Stamp Box -->
        <div class="stamp-box">
          OFFICIAL STAMP<br>
          (If applicable)
        </div>
        
        <!-- Signatures -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">
              <div class="signature-label">Received By</div>
              <div class="signature-name">${o.agents.primary.name}</div>
              <div class="signature-name" style="font-size: 9pt; margin-top: 3px;">${new Date(e.paidDate).toLocaleDateString()}</div>
            </div>
          </div>
          <div class="signature-box">
            <div class="signature-line">
              <div class="signature-label">Paid By</div>
              <div class="signature-name">${o.parties.buyer.name}</div>
              <div class="signature-name" style="font-size: 9pt; margin-top: 3px;">${new Date(e.paidDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-important">
            This is an official payment receipt issued by aaraazi.
          </div>
          <div class="footer-text">
            Receipt generated on ${new Date(a.generatedAt).toLocaleDateString()} at ${new Date(a.generatedAt).toLocaleTimeString()}<br>
            Generated by: ${a.generatedBy}<br>
            For queries, please contact your real estate agent or property manager.
          </div>
        </div>
        
        <!-- Watermark -->
        <div class="version-watermark">
          ${a.receiptNumber}<br>
          Payment ID: ${e.id.substring(0,8)}<br>
          Version ${a.version}
        </div>
      </div>
      
      <!-- Print Button -->
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="
          background-color: #030213;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12pt;
          font-weight: 500;
          margin-right: 10px;
        ">
          🖨️ Print Receipt
        </button>
        <button onclick="window.close()" style="
          background-color: white;
          color: #030213;
          border: 2px solid #ececf0;
          padding: 14px 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12pt;
          font-weight: 500;
        ">
          Close
        </button>
      </div>
    </body>
    </html>
  `}function N(i){const a=S(i);if(!a)throw new Error("Receipt not found or unable to generate");const o=window.open("","_blank");if(!o)throw new Error("Please allow popups to view receipt");o.document.write(a),o.document.close()}function E(i){if(i===0)return"Zero";const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"],o=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],e=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];function t(l){return l===0?"":l<10?a[l]:l<20?e[l-10]:l<100?o[Math.floor(l/10)]+(l%10!==0?" "+a[l%10]:""):a[Math.floor(l/100)]+" Hundred"+(l%100!==0?" "+t(l%100):"")}const n=Math.floor(i/1e7),r=Math.floor(i%1e7/1e5),s=Math.floor(i%1e5/1e3),d=Math.floor(i%1e3);let c="";return n>0&&(c+=t(n)+" Crore "),r>0&&(c+=t(r)+" Lakh "),s>0&&(c+=t(s)+" Thousand "),d>0&&(c+=t(d)),c.trim()}const M=(i,a,o,e)=>{const t=m(i);if(!t)throw new Error(`Deal ${i} not found`);if(t.agents.primary.id!==a)throw new Error("Only primary agent can create payment plan");if(t.financial.paymentPlan)throw new Error("Payment plan already exists. Use modify functions to change it.");const n=new Date().toISOString(),r=t.financial.agreedPrice,s=r*(e.downPaymentPercentage/100),c=(r-s)/e.numberOfInstallments,l=[];l.push({id:`inst_${Date.now()}_0`,sequence:1,amount:s,dueDate:e.downPaymentDate,description:`Down Payment (${e.downPaymentPercentage}%)`,status:"pending",paidAmount:0,paymentIds:[],wasModified:!1});const u=new Date(e.firstInstallmentDate),x=e.frequency==="monthly"?30:90;for(let p=0;p<e.numberOfInstallments;p++){const g=new Date(u);g.setDate(g.getDate()+p*x),l.push({id:`inst_${Date.now()}_${p+1}`,sequence:p+2,amount:c,dueDate:g.toISOString(),description:p===e.numberOfInstallments-1?`Final Payment (Installment ${p+1} of ${e.numberOfInstallments})`:`Installment ${p+1} of ${e.numberOfInstallments}`,status:"pending",paidAmount:0,paymentIds:[],wasModified:!1})}const P={createdAt:n,createdBy:a,lastModified:n,modifiedBy:a,totalAmount:r,installments:l,modifications:[],status:"active"};return t.financial.paymentPlan=P,t.financial.paymentState="plan-active",f(i,{financial:t.financial})},O=(i,a,o,e)=>{const t=m(i);if(!t)throw new Error(`Deal ${i} not found`);if(t.agents.primary.id!==a)throw new Error("Only primary agent can record payments");const n=new Date().toISOString(),r={id:`pay_${Date.now()}`,dealId:i,type:"ad-hoc",amount:e.amount,paidDate:e.paidDate,installmentId:void 0,status:"recorded",recordedBy:{agentId:a,agentName:o,agentRole:"primary"},paymentMethod:e.paymentMethod,referenceNumber:e.referenceNumber,receiptNumber:e.receiptNumber,notes:e.notes,createdAt:n,updatedAt:n};return r.receiptNumber||(r.receiptNumber=b(r,t,o)),t.financial.payments.push(r),t.financial.totalPaid+=e.amount,t.financial.balanceRemaining-=e.amount,t.financial.balanceRemaining<=0&&(t.financial.paymentState="fully-paid"),f(i,{financial:t.financial})},z=(i,a,o,e)=>{const t=m(i);if(!t)throw new Error(`Deal ${i} not found`);if(t.agents.primary.id!==a)throw new Error("Only primary agent can record payments");if(!t.financial.paymentPlan)throw new Error("Payment plan does not exist");const n=t.financial.paymentPlan.installments.find(l=>l.id===e.installmentId);if(!n)throw new Error("Installment not found");const r=new Date().toISOString();let s="installment";n.description.toLowerCase().includes("down payment")?s="down-payment":n.description.toLowerCase().includes("token")?s="token":n.description.toLowerCase().includes("final")&&(s="final-payment");const d={id:`pay_${Date.now()}`,dealId:i,type:s,amount:e.amount,paidDate:e.paidDate,installmentId:e.installmentId,status:"recorded",recordedBy:{agentId:a,agentName:o,agentRole:"primary"},paymentMethod:e.paymentMethod,referenceNumber:e.referenceNumber,receiptNumber:e.receiptNumber,notes:e.notes,createdAt:r,updatedAt:r};return d.receiptNumber||(d.receiptNumber=b(d,t,o)),t.financial.payments.push(d),n.paidAmount+=e.amount,n.paymentIds.push(d.id),n.paidAmount>=n.amount?(n.status="paid",n.paidDate=e.paidDate):n.paidAmount>0&&(n.status="partial"),t.financial.totalPaid+=e.amount,t.financial.balanceRemaining-=e.amount,t.financial.paymentPlan.installments.every(l=>l.status==="paid")&&(t.financial.paymentState="fully-paid",t.financial.paymentPlan.status="completed"),f(i,{financial:t.financial})},C=(i,a,o,e)=>{const t=m(i);if(!t)throw new Error(`Deal ${i} not found`);if(t.agents.primary.id!==a)throw new Error("Only primary agent can modify payment plan");if(!t.financial.paymentPlan)throw new Error("Payment plan does not exist");const n=new Date().toISOString(),r={id:`inst_${Date.now()}`,sequence:t.financial.paymentPlan.installments.length+1,amount:e.amount,dueDate:e.dueDate,description:e.description,status:"pending",paidAmount:0,paymentIds:[],wasModified:!1};t.financial.paymentPlan.installments.push(r),t.financial.paymentPlan.installments.forEach((d,c)=>{d.sequence=c+1}),t.financial.paymentPlan.totalAmount+=e.amount,t.financial.agreedPrice+=e.amount,t.financial.balanceRemaining+=e.amount;const s={id:`mod_${Date.now()}`,modifiedAt:n,modifiedBy:a,modifiedByName:o,modificationType:"installment-added",changes:[{field:"installments",oldValue:t.financial.paymentPlan.installments.length-1,newValue:t.financial.paymentPlan.installments.length},{field:"totalAmount",oldValue:t.financial.paymentPlan.totalAmount-e.amount,newValue:t.financial.paymentPlan.totalAmount}],reason:e.reason};return t.financial.paymentPlan.modifications.push(s),t.financial.paymentPlan.lastModified=n,t.financial.paymentPlan.modifiedBy=a,t.financial.paymentState="plan-modified",f(i,{financial:t.financial})},B=(i,a,o,e)=>{const t=m(i);if(!t)throw new Error(`Deal ${i} not found`);if(t.agents.primary.id!==a)throw new Error("Only primary agent can modify payment plan");if(!t.financial.paymentPlan)throw new Error("Payment plan does not exist");const n=t.financial.paymentPlan.installments.find(d=>d.id===e.installmentId);if(!n)throw new Error("Installment not found");const r=new Date().toISOString(),s=[];if(n.wasModified||(n.originalAmount=n.amount,n.originalDueDate=n.dueDate),e.newAmount!==void 0&&e.newAmount!==n.amount){const d=n.amount,c=e.newAmount-d;n.amount=e.newAmount,t.financial.paymentPlan.totalAmount+=c,t.financial.agreedPrice+=c,t.financial.balanceRemaining+=c,s.push({field:"amount",oldValue:d,newValue:e.newAmount})}if(e.newDueDate&&e.newDueDate!==n.dueDate){const d=n.dueDate;n.dueDate=e.newDueDate,s.push({field:"dueDate",oldValue:d,newValue:e.newDueDate})}if(n.wasModified=!0,n.modifiedAt=r,n.modificationReason=e.reason,s.length>0){const d={id:`mod_${Date.now()}`,modifiedAt:r,modifiedBy:a,modifiedByName:o,modificationType:e.newAmount?"amount-changed":"date-changed",changes:s,reason:e.reason};t.financial.paymentPlan.modifications.push(d),t.financial.paymentPlan.lastModified=r,t.financial.paymentPlan.modifiedBy=a,t.financial.paymentState="plan-modified"}return f(i,{financial:t.financial})},_=(i,a,o,e,t)=>{const n=m(i);if(!n)throw new Error(`Deal ${i} not found`);if(n.agents.primary.id!==a)throw new Error("Only primary agent can delete installments");if(!n.financial.paymentPlan)throw new Error("Payment plan does not exist");const r=n.financial.paymentPlan.installments.findIndex(l=>l.id===e);if(r===-1)throw new Error("Installment not found");const s=n.financial.paymentPlan.installments[r];if(s.paidAmount>0)throw new Error("Cannot delete installment with payments. Only pending installments can be deleted.");const d=new Date().toISOString();n.financial.paymentPlan.installments.splice(r,1),n.financial.paymentPlan.installments.forEach((l,u)=>{l.sequence=u+1}),n.financial.paymentPlan.totalAmount-=s.amount,n.financial.agreedPrice-=s.amount,n.financial.balanceRemaining-=s.amount;const c={id:`mod_${Date.now()}`,modifiedAt:d,modifiedBy:a,modifiedByName:o,modificationType:"installment-removed",changes:[{field:"installments",oldValue:n.financial.paymentPlan.installments.length+1,newValue:n.financial.paymentPlan.installments.length},{field:"deletedInstallment",oldValue:s.description,newValue:null}],reason:t};return n.financial.paymentPlan.modifications.push(c),n.financial.paymentPlan.lastModified=d,n.financial.paymentPlan.modifiedBy=a,n.financial.paymentState="plan-modified",f(i,{financial:n.financial})},I=i=>{const a=m(i);if(!a)throw new Error(`Deal ${i} not found`);const o=a.financial.paymentPlan,e=new Date;let t=0,n=0,r=0,s=null;const d=[];if(o){t=o.installments.length,n=o.installments.filter(l=>l.status==="paid").length,r=o.installments.filter(l=>l.status==="pending"||l.status==="partial").length;const c=o.installments.filter(l=>l.status!=="paid").sort((l,u)=>new Date(l.dueDate).getTime()-new Date(u.dueDate).getTime());if(c.length>0){const l=c[0];s={date:l.dueDate,amount:l.amount-l.paidAmount,description:l.description}}o.installments.forEach(l=>{(l.status==="pending"||l.status==="partial")&&new Date(l.dueDate)<e&&(l.status="overdue",d.push(l))})}return{totalAmount:a.financial.agreedPrice,totalPaid:a.financial.totalPaid,totalPending:a.financial.balanceRemaining,percentagePaid:a.financial.totalPaid/a.financial.agreedPrice*100,paymentPlanStatus:a.financial.paymentState,installmentCount:t,paidInstallmentCount:n,pendingInstallmentCount:r,nextPaymentDue:s,overduePayments:d}},k=i=>{const a=m(i);if(!a)return null;const o=I(i);return{dealNumber:a.dealNumber,agreedPrice:a.financial.agreedPrice,property:{id:a.cycles.sellCycle.propertyId,address:`Property ${a.cycles.sellCycle.propertyId}`},seller:a.parties.seller,buyer:a.parties.buyer,agents:a.agents,plan:a.financial.paymentPlan,payments:a.financial.payments,summary:o}};export{z as a,C as b,M as c,_ as d,k as e,I as g,T as h,B as m,O as r,N as v};
