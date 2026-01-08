import{E as k,r as l,j as e,B as s,C as x,c as f,a2 as p,a as L,A as T,b as M,d as F,ad as G,ae as B,af as q,ag as Y,ah as U,L as H,I as V,as as R,bh as w,aC as z,v as h}from"./index-hZmLyELT.js";import{A as $}from"./arrow-left-B8WI-nKV.js";import{C as K}from"./copy-Cq6xhlgv.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["path",{d:"M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5",key:"1couwa"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",key:"1y4qbx"}]],Q=k("file-pen",W);function X(i,a){const c=i.requiredFields.filter(o=>!a[o]);if(c.length>0)return{success:!1,missingFields:c};let t=i.template;return Object.keys(a).forEach(o=>{const y=`{{${o}}}`,d=a[o];t=t.replace(new RegExp(y,"g"),d)}),{success:!0,content:t}}const Z={id:"property-listing-agreement",name:"Property Listing Agreement",category:"agreement",description:"Standard agreement between property owner and agency",requiredFields:["ownerName","ownerCNIC","propertyAddress","listingPrice","commissionRate","agencyName","agentName","date"],template:`
PROPERTY LISTING AGREEMENT

This Agreement is made on {{date}} between:

1. {{ownerName}} (CNIC: {{ownerCNIC}})
   Hereinafter referred to as "the Owner"

AND

2. {{agencyName}}, represented by {{agentName}}
   Hereinafter referred to as "the Agency"

PROPERTY DETAILS:
Address: {{propertyAddress}}
Listing Price: {{listingPrice}}
Property Type: {{propertyType}}

TERMS AND CONDITIONS:

1. LISTING PERIOD
   The Owner authorizes the Agency to list and market the property for a period of {{listingPeriod}} months from the date of this agreement.

2. COMMISSION
   The Owner agrees to pay the Agency a commission of {{commissionRate}}% of the final sale price upon successful completion of the transaction.

3. EXCLUSIVE RIGHTS
   The Agency has exclusive rights to market this property during the listing period.

4. MARKETING
   The Agency agrees to market the property through various channels including online portals, social media, and direct outreach.

5. TERMINATION
   Either party may terminate this agreement with 30 days written notice.

Owner's Signature: _________________        Date: _________________

Agency Representative: _________________    Date: _________________
`,preview:"Legal agreement for property listing services"},J={id:"sale-deed-receipt",name:"Sale Deed Receipt",category:"receipt",description:"Receipt for property sale transaction",requiredFields:["buyerName","sellerName","propertyAddress","salePrice","date","receiptNumber"],template:`
SALE DEED RECEIPT

Receipt No: {{receiptNumber}}
Date: {{date}}

Received from: {{buyerName}}
Amount: {{salePrice}} ({{saleAmountWords}})

For the purchase of property located at:
{{propertyAddress}}

Sold by: {{sellerName}}

Payment Method: {{paymentMethod}}

This receipt acknowledges the payment for the above-mentioned property transaction.

Received by: _________________

{{agencyName}}
{{agentName}}
`,preview:"Receipt for property sale payment"},ee={id:"buyer-representation",name:"Buyer Representation Agreement",category:"agreement",description:"Agreement to represent buyer in property search",requiredFields:["buyerName","buyerCNIC","agencyName","agentName","date"],template:`
BUYER REPRESENTATION AGREEMENT

Date: {{date}}

This Agreement is entered into between:

BUYER:
Name: {{buyerName}}
CNIC: {{buyerCNIC}}
Phone: {{buyerPhone}}

AGENCY:
{{agencyName}}
Represented by: {{agentName}}

PROPERTY REQUIREMENTS:
Type: {{propertyType}}
Budget: {{budgetRange}}
Preferred Locations: {{preferredLocations}}

TERMS:
1. The Agency agrees to represent the Buyer in searching for and negotiating the purchase of a suitable property.

2. The Agency will receive a commission of {{commissionRate}}% from the seller upon successful purchase.

3. This agreement is valid for {{agreementPeriod}} months from the date signed.

4. The Buyer agrees to work exclusively with the Agency during this period.

5. The Agency will provide market analysis, property viewings, and negotiation support.

Buyer's Signature: _________________        Date: _________________

Agency Representative: _________________    Date: _________________
`,preview:"Agreement to represent buyer in property search"},re={id:"property-brochure",name:"Property Marketing Brochure",category:"marketing",description:"Marketing material for property listing",requiredFields:["propertyTitle","propertyAddress","price","bedrooms","bathrooms","area"],template:`
{{propertyTitle}}

PROPERTY HIGHLIGHTS
─────────────────────────────────────

📍 Location: {{propertyAddress}}
💰 Price: {{price}}
🛏️ Bedrooms: {{bedrooms}}
🚿 Bathrooms: {{bathrooms}}
📐 Area: {{area}} sq ft

DESCRIPTION
─────────────────────────────────────
{{description}}

KEY FEATURES
─────────────────────────────────────
{{features}}

AMENITIES
─────────────────────────────────────
{{amenities}}

CONTACT
─────────────────────────────────────
{{agentName}}
{{agencyName}}
📞 {{agentPhone}}
✉️ {{agentEmail}}

Schedule your viewing today!
`,preview:"Professional property marketing brochure"},te={id:"offer-letter",name:"Purchase Offer Letter",category:"letter",description:"Formal offer letter for property purchase",requiredFields:["buyerName","sellerName","propertyAddress","offerPrice","date"],template:`
PURCHASE OFFER LETTER

Date: {{date}}

To: {{sellerName}}

Subject: Formal Offer to Purchase Property at {{propertyAddress}}

Dear {{sellerName}},

I, {{buyerName}}, hereby submit a formal offer to purchase the property located at:

{{propertyAddress}}

OFFER DETAILS:
─────────────────────────────────────
Offered Price: {{offerPrice}}
Payment Terms: {{paymentTerms}}
Possession Date: {{possessionDate}}
Conditions: {{conditions}}

This offer is valid until {{offerValidUntil}}.

I am ready to proceed with the purchase and can arrange for the necessary documentation and payments as per the agreed terms.

I look forward to your positive response.

Sincerely,

{{buyerName}}
CNIC: {{buyerCNIC}}
Phone: {{buyerPhone}}

Through:
{{agencyName}}
Agent: {{agentName}}
`,preview:"Formal letter to make purchase offer"},ae={id:"viewing-confirmation",name:"Property Viewing Confirmation",category:"letter",description:"Confirmation letter for property viewing appointment",requiredFields:["clientName","propertyAddress","viewingDate","viewingTime","agentName"],template:`
PROPERTY VIEWING CONFIRMATION

Dear {{clientName}},

This is to confirm your appointment to view the property located at:

{{propertyAddress}}

VIEWING DETAILS:
─────────────────────────────────────
Date: {{viewingDate}}
Time: {{viewingTime}}
Meeting Point: {{meetingPoint}}

Your viewing will be conducted by {{agentName}} from {{agencyName}}.

PLEASE BRING:
• Valid photo ID
• Proof of funds (if interested in making an offer)

If you need to reschedule, please contact us at least 24 hours in advance.

Contact: {{agentPhone}}

We look forward to showing you this property!

Best regards,

{{agentName}}
{{agencyName}}
`,preview:"Confirmation for scheduled property viewing"},se={id:"market-analysis",name:"Comparative Market Analysis",category:"report",description:"Market analysis report for property valuation",requiredFields:["propertyAddress","estimatedValue","date"],template:`
COMPARATIVE MARKET ANALYSIS (CMA)

Property: {{propertyAddress}}
Date: {{date}}
Prepared by: {{agentName}}, {{agencyName}}

PROPERTY DETAILS
─────────────────────────────────────
Type: {{propertyType}}
Area: {{area}} sq ft
Bedrooms: {{bedrooms}}
Bathrooms: {{bathrooms}}
Condition: {{condition}}

ESTIMATED VALUE
─────────────────────────────────────
Recommended Listing Price: {{estimatedValue}}
Price per sq ft: {{pricePerSqft}}

MARKET ANALYSIS
─────────────────────────────────────
Average Days on Market: {{avgDaysOnMarket}} days
Recent Sales in Area: {{recentSalesCount}}
Price Trend: {{priceTrend}}

COMPARABLE PROPERTIES
─────────────────────────────────────
{{comparableProperties}}

RECOMMENDATIONS
─────────────────────────────────────
{{recommendations}}

This analysis is based on current market conditions and comparable sales data.

Prepared by: {{agentName}}
License: {{agentLicense}}
`,preview:"Professional market analysis and valuation report"},E=[Z,J,ee,re,te,ae,se];function C(i){return E.filter(a=>a.category===i)}function ne(){return[{value:"agreement",label:"Agreements"},{value:"letter",label:"Letters"},{value:"receipt",label:"Receipts"},{value:"report",label:"Reports"},{value:"marketing",label:"Marketing"},{value:"legal",label:"Legal"}]}const ce=({onBack:i})=>{const[a,c]=l.useState("all"),[t,o]=l.useState(null),[y,d]=l.useState(!1),[u,_]=l.useState({}),[g,N]=l.useState(""),[b,A]=l.useState(!1),j=ne(),v=a==="all"?E:C(a),P=r=>({agreement:"bg-blue-100 text-blue-800 border-blue-300",letter:"bg-green-100 text-green-800 border-green-300",receipt:"bg-yellow-100 text-yellow-800 border-yellow-300",report:"bg-purple-100 text-purple-800 border-purple-300",marketing:"bg-pink-100 text-pink-800 border-pink-300",legal:"bg-red-100 text-red-800 border-red-300"})[r],I=r=>{o(r),_({date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),agencyName:"aaraazi Agency",agentName:"",agentPhone:"",agentEmail:""}),N(""),d(!0)},D=()=>{if(!t)return;const r=X(t,u);if(!r.success){h.error(`Missing required fields: ${r.missingFields?.join(", ")}`);return}N(r.content||""),h.success("Document generated successfully!")},S=()=>{navigator.clipboard.writeText(g),A(!0),h.success("Document copied to clipboard!"),setTimeout(()=>A(!1),2e3)},O=()=>{const r=new Blob([g],{type:"text/plain"}),n=URL.createObjectURL(r),m=document.createElement("a");m.href=n,m.download=`${t?.name.replace(/\s+/g,"-")}-${Date.now()}.txt`,m.click(),URL.revokeObjectURL(n),h.success("Document downloaded!")};return e.jsxs("div",{className:"min-h-screen bg-gray-50",children:[e.jsx("div",{className:"bg-white border-b border-gray-200 px-6 py-4",children:e.jsx("div",{className:"flex items-center justify-between",children:e.jsxs("div",{children:[e.jsxs(s,{variant:"ghost",size:"sm",onClick:i,className:"mb-2",children:[e.jsx($,{className:"h-4 w-4 mr-2"}),"Back"]}),e.jsx("h1",{className:"text-2xl text-gray-900",children:"Document Templates"}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"Pre-built templates for common real estate documents"})]})})}),e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsx(x,{children:e.jsx(f,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(p,{className:"h-4 w-4 text-gray-500"}),e.jsx("span",{className:"text-sm text-gray-700",children:"Category:"}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs(s,{variant:a==="all"?"default":"outline",size:"sm",onClick:()=>c("all"),children:["All Templates (",E.length,")"]}),j.map(r=>e.jsxs(s,{variant:a===r.value?"default":"outline",size:"sm",onClick:()=>c(r.value),children:[r.label," (",C(r.value).length,")"]},r.value))]})]})})}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:v.map(r=>e.jsxs(x,{className:"hover:shadow-lg transition-shadow",children:[e.jsxs(L,{children:[e.jsxs("div",{className:"flex items-start justify-between mb-2",children:[e.jsx(Q,{className:"h-5 w-5 text-blue-600"}),e.jsx(T,{variant:"outline",className:P(r.category),children:r.category})]}),e.jsx(M,{className:"text-base",children:r.name}),e.jsx(F,{children:r.description})]}),e.jsx(f,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-600 mb-1",children:"Required Fields:"}),e.jsxs("div",{className:"flex flex-wrap gap-1",children:[r.requiredFields.slice(0,3).map((n,m)=>e.jsx(T,{variant:"outline",className:"text-xs",children:n},m)),r.requiredFields.length>3&&e.jsxs(T,{variant:"outline",className:"text-xs",children:["+",r.requiredFields.length-3," more"]})]})]}),e.jsxs(s,{onClick:()=>I(r),className:"w-full",size:"sm",children:[e.jsx(p,{className:"h-4 w-4 mr-2"}),"Generate Document"]})]})})]},r.id))}),v.length===0&&e.jsx(x,{children:e.jsxs(f,{className:"p-12 text-center",children:[e.jsx(p,{className:"h-12 w-12 mx-auto mb-3 text-gray-400"}),e.jsx("p",{className:"text-gray-600",children:"No templates found in this category"})]})})]}),t&&e.jsx(G,{open:y,onOpenChange:d,children:e.jsxs(B,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[e.jsxs(q,{children:[e.jsx(Y,{className:"text-base",children:t.name}),e.jsx(U,{children:t.description})]}),g?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(w,{className:"h-5 w-5 text-green-600"}),e.jsx("span",{className:"text-sm text-green-600",children:"Document generated successfully!"})]}),e.jsx("div",{className:"bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto",children:e.jsx("pre",{className:"text-xs whitespace-pre-wrap text-gray-900",children:g})}),e.jsxs(R,{children:[e.jsxs(s,{variant:"outline",onClick:()=>{N(""),_({})},children:[e.jsx(p,{className:"h-4 w-4 mr-2"}),"Generate Another"]}),e.jsxs(s,{variant:"outline",onClick:S,children:[b?e.jsx(w,{className:"h-4 w-4 mr-2"}):e.jsx(K,{className:"h-4 w-4 mr-2"}),b?"Copied!":"Copy"]}),e.jsxs(s,{onClick:O,children:[e.jsx(z,{className:"h-4 w-4 mr-2"}),"Download"]})]})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Fill in the required fields to generate the document:"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:t.requiredFields.map(r=>e.jsxs("div",{children:[e.jsx(H,{className:"capitalize",children:r.replace(/([A-Z])/g," $1").trim()}),e.jsx(V,{value:u[r]||"",onChange:n=>_({...u,[r]:n.target.value}),placeholder:`Enter ${r}`})]},r))}),e.jsxs(R,{children:[e.jsx(s,{variant:"outline",onClick:()=>d(!1),children:"Cancel"}),e.jsxs(s,{onClick:D,children:[e.jsx(p,{className:"h-4 w-4 mr-2"}),"Generate"]})]})]})]})})]})};export{ce as DocumentTemplates};
