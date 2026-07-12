// Simulate the render function's button generation with real data
const debt = {
  id: "41ef6b6c-a650-4a0e-aa81-a973ed4445a5",
  creditor: "lty060409@163.com",
  debtor: "2386757305@qq.com",
  reason: "test",
  count: 1,
  part: "butt",
  tool: "ruler",
  date: "2026-07-12",
  ddl: "2026-07-19",
  confirmed: false,
  repayments: [],
  reductions: []
};
const myEmail = "lty060409@163.com";
const T_STRS = {payTitle:"pay", confBtn:"conf", revokeBtn:"rev", downUnit:"xia", dayUnit:"tian"};
const settings = {dailyRate:1};

// Replicate the status logic
function repaidSum(d){const rp=(d.repayments||[]).reduce((s,r)=>s+r.count,0);const rd=(d.reductions||[]).reduce((s,r)=>s+r.count,0);return rp+rd;}
function remaining(d){return Math.max(0,d.count-repaidSum(d));}
function overdueDays(d){const t="2026-07-13";return t>d.ddl?Math.max(0,Math.floor((new Date(t+"T00:00:00")-new Date(d.ddl+"T00:00:00"))/86400000)):0;}
function currentCount(d){const r=remaining(d);if(r<=0)return 0;const od=overdueDays(d);if(od<=0)return r;return Math.ceil(r*Math.pow(1+settings.dailyRate/100,od));}
function status(d){if(d.confirmed)return"cleared";if(remaining(d)<=0)return"awaiting";return overdueDays(d)>0?"overdue":"pending";}

const s = status(debt);
console.log("status:", s);
console.log("remaining:", remaining(debt));
console.log("currentCount:", currentCount(debt));
console.log("overdueDays:", overdueDays(debt));
console.log("creditor===myEmail:", debt.creditor===myEmail);

// Generate the act string like render does
let act="";
if(s==="pending"||s==="overdue"){
  act="<button class=\"btn btn-sm btn-pay\" onclick=\"openPay(\x27"+debt.id+"\x27)\">"+T_STRS.payTitle+"</button>";
  if(debt.creditor===myEmail){
    act+="<button class=\"btn btn-sm btn-conf\" onclick=\"openReduction(\x27"+debt.id+"\x27)\">\ud83c\udfab\u53d1\u5238</button>";
  }
}
console.log("\nGenerated act HTML:");
console.log(act);
console.log("\nDoes it contain openReduction?", act.includes("openReduction"));
