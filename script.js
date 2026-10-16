let cafeName = '';
let coffeePrice = 1500;
let isOpen = false;
let cash = 0;
let sales = 0;
let stage = 0;
let confirmed = false;
let chapter = 1;
let unlocked = 1;
let typeInspected = false;
let converted = false;
let settled = false;
let incomingPrice;
let incomingQuantity = '2';
let orderPrice;
let orderQuantity;
let pickupTime;
let coupon;
let emptyInspected = false;
let pickupRecorded = false;
let couponConfirmed = false;
let reservationComplete = false;
const el = id => document.getElementById(id);
const won = value => value.toLocaleString('ko-KR')+'원';
const titles=['간판에 이름을 붙여요','커피 가격을 정해요','문을 열고 손님을 맞이해요','첫 한 잔을 판매해보세요'];
const descriptions=['가게 이름은 읽을 글자예요. 입력하면 간판에 바로 보여요.','가격은 매출 계산에 써요. 숫자로 저장하고 메뉴판에 붙여보세요.','영업 상태를 false에서 true로 바꾸면 손님이 들어와요.','커피 한 잔을 팔아 가게를 연 결과를 확인해요.'];
function live(code,text){el('live-value').replaceChildren();const c=document.createElement('code');c.textContent=code;const p=document.createElement('span');p.textContent=text;el('live-value').append(c,p);}
function concept(text){el('concept').hidden=false;el('concept').textContent=text;}
function summary(){el('summary-values').replaceChildren();[['문자열 · string',`${JSON.stringify(cafeName)} → 간판 이름`],['숫자 · number',`${coffeePrice} → 한 잔의 가격`],['불리언 · boolean',`${isOpen} → 영업 상태`]].forEach(([a,b])=>{const dt=document.createElement('dt');dt.textContent=a;const dd=document.createElement('dd');dd.textContent=b;el('summary-values').append(dt,dd);});}
function reservationView(){el('pickup-status').textContent=pickupRecorded?pickupTime:'아직 정해지지 않음';el('coupon-status').textContent=couponConfirmed?'사용 안 함 (null)':'아직 확인 전 (undefined)';el('reservation-code').textContent=`${pickupRecorded?`let pickupTime = ${JSON.stringify(pickupTime)};`:'let pickupTime;'}\n${couponConfirmed?'let coupon = null;':'let coupon;'}`;}
function render(){
 el('cafe-sign').textContent=cafeName||'이름 없는 작은 카페';el('menu-price').textContent=stage>=2||confirmed&&stage===1?won(coffeePrice):'가격 준비 중';
 el('open-sign').textContent=isOpen?'OPEN':'CLOSED';document.querySelector('.room').classList.toggle('closed',!isOpen);
 el('customers').replaceChildren();const label=document.createElement('small');label.textContent=chapter===3?'민지: 예약 정보를 확인해주세요.':chapter===2?(settled?'키오스크 주문 결제 완료!':'키오스크: 커피 2잔 주문!'):isOpen?'아메리카노 한 잔 주세요!':'아직 영업 전이에요';el('customers').append(document.createTextNode(isOpen?'🧑　👩　🧔':'🚪'),label);
 el('cash').textContent=won(cash);el('sales').textContent=sales+'잔';el('sell').hidden=chapter!==1;el('sell').disabled=!isOpen||stage!==3;el('toggle-open').hidden=chapter!==1||stage!==3;el('toggle-open').textContent=isOpen?'영업 종료하기':'다시 문 열기';
 el('setup').hidden=chapter!==1;el('progress').hidden=chapter!==1;el('day1-done').hidden=chapter!==1||unlocked<2;el('day2-panel').hidden=chapter!==2;el('day3-panel').hidden=chapter!==3;
 el('day-label').textContent=['','DAY 01 · 오픈 준비 · 기본 자료형','DAY 02 · 계산대 · typeof와 형변환','DAY 03 · 예약 관리 · undefined와 null'][chapter];
 ['오픈 준비','계산대','예약 주문'].forEach((name,index)=>{const day=index+1;const b=el(`day-${day}`);b.disabled=day>unlocked;b.textContent=`${day>unlocked?'🔒 ':''}${day}일차 · ${name}`;if(chapter===day)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 el('step-label').textContent=`${stage+1} / 4 · 오픈 준비`;el('step-title').textContent=titles[stage];el('step-description').textContent=descriptions[stage];
 ['name-form','price-form','open-task','sale-task'].forEach((id,index)=>el(id).hidden=stage!==index);
 document.querySelectorAll('#progress li').forEach((node,index)=>{node.className=index===stage?'active':index<stage?'done':'';});
 el('continue').hidden=!(confirmed&&stage<2);if(unlocked>=2)summary();reservationView();
}
function changeChapter(day){if(day>unlocked)return;chapter=day;render();const headings=['','step-title','day2-title','day3-title'];el(headings[day]).focus();if(day===2){renderIncoming();live(settled?'cash += orderPrice * orderQuantity;':`receivedPrice = ${JSON.stringify(incomingPrice)};`,settled?'숫자로 변환한 예약 주문을 결제했어요.':'키오스크에서 가격이 문자열로 들어왔어요. 계산대를 점검해주세요.');el('caption').textContent=settled?'두 잔 주문을 처리했어요.':'두 잔 주문은 오른쪽 계산대에서 결제해요.';}if(day===3){live(pickupRecorded?`pickupTime = ${JSON.stringify(pickupTime)};`:'let pickupTime;','예약 정보를 확인하며 비어 있는 값의 의미를 구분해요.');el('caption').textContent='예약 손님의 픽업 시간과 쿠폰을 정리해주세요.';}}
el('name-input').addEventListener('input',()=>{if(stage!==0)return;cafeName=el('name-input').value.trim();confirmed=false;el('concept').hidden=true;el('feedback').textContent='';el('name-code').textContent=`const cafeName = ${JSON.stringify(cafeName)};`;live(`cafeName = ${JSON.stringify(cafeName)}`,'입력한 글자가 간판에 나타나요.');render();});
el('name-form').addEventListener('submit',event=>{event.preventDefault();cafeName=el('name-input').value.trim();if(!cafeName){el('feedback').textContent='이름을 입력해주세요.';return;}confirmed=true;concept('이름은 문자열(string)이에요. 코드에서는 따옴표로 감싸요.');el('feedback').textContent='✓ 간판을 달았어요!';render();});
el('continue').addEventListener('click',()=>{if(!confirmed||stage>=2)return;stage+=1;confirmed=false;el('concept').hidden=true;el('feedback').textContent='';render();el('step-title').focus();});
el('price-input').addEventListener('input',()=>{confirmed=false;el('continue').hidden=true;const value=el('price-input').valueAsNumber;el('price-code').textContent=Number.isFinite(value)?`let coffeePrice = ${value};`:'// 숫자를 입력해주세요';});
el('price-form').addEventListener('submit',event=>{event.preventDefault();const value=el('price-input').valueAsNumber;if(!Number.isInteger(value)||value<500||value>10000||value%100!==0){el('feedback').textContent='500~10,000원 사이, 100원 단위로 입력해주세요.';return;}coffeePrice=value;confirmed=true;live(`coffeePrice = ${coffeePrice}`,'이 숫자가 실제 한 잔의 판매 금액이에요.');concept('가격은 숫자(number)예요. 숫자는 따옴표 없이 적고 계산에 사용해요.');el('feedback').textContent='✓ 가격을 정했어요!';render();});
el('open-door').addEventListener('click',()=>{if(stage!==2)return;isOpen=true;stage=3;confirmed=false;el('concept').hidden=true;el('feedback').textContent='✓ 문이 열렸어요!';el('caption').textContent='첫 손님에게 커피를 판매해보세요.';live('isOpen = true;','false → true · 두 가지 상태를 나타내는 불리언이에요.');render();});
el('sell').addEventListener('click',()=>{if(chapter!==1||stage!==3||!isOpen)return;const before=cash;cash+=coffeePrice;sales+=1;el('sale-code').textContent=`cash += coffeePrice;\n// ${before} + ${coffeePrice} → ${cash}`;el('cup').textContent='☕ 판매 완료';el('caption').textContent='첫날 영업 성공! 2일차 계산대 점검을 시작할 수 있어요.';live(`cash += ${coffeePrice};`,`매출 ${won(before)} → ${won(cash)}`);const p=document.createElement('p');p.textContent=`영수증 ${sales} · ${won(coffeePrice)}`;el('receipt-list').replaceChildren(p);if(unlocked<2){unlocked=2;incomingPrice=String(coffeePrice);}render();});
el('toggle-open').addEventListener('click',()=>{if(chapter!==1||stage!==3)return;isOpen=!isOpen;live(`isOpen = ${isOpen};`,isOpen?'문을 열어 판매할 수 있어요.':'문을 닫아 판매가 멈춰요.');render();});
[1,2,3].forEach(day=>el(`day-${day}`).addEventListener('click',()=>changeChapter(day)));
el('go-day2').addEventListener('click',()=>changeChapter(2));el('go-day3').addEventListener('click',()=>changeChapter(3));
function renderIncoming(){el('incoming').textContent=`한 잔 ${incomingPrice}원 · ${incomingQuantity}잔`;el('incoming-code').textContent=`let receivedPrice = ${JSON.stringify(incomingPrice)};\nlet receivedQuantity = "2";`;}
el('inspect-type').addEventListener('click',()=>{if(chapter!==2||typeInspected)return;typeInspected=true;el('type-result').hidden=false;el('inspect-type').disabled=true;el('type-code').textContent=`typeof receivedPrice; // "${typeof incomingPrice}"\ntypeof receivedQuantity; // "${typeof incomingQuantity}"`;el('wrong-sum').textContent=`"${incomingPrice}" + "${incomingPrice}"`;el('wrong-result').textContent=`결과: "${incomingPrice+incomingPrice}"`;live('typeof receivedPrice; // "string"','가격처럼 보여도 문자열이었어요. typeof로 확인했어요.');});
el('convert-number').addEventListener('click',()=>{if(chapter!==2||!typeInspected||converted)return;orderPrice=Number(incomingPrice);orderQuantity=Number(incomingQuantity);converted=true;el('convert-number').disabled=true;el('conversion-result').hidden=false;el('convert-code').textContent=`const orderPrice = Number(receivedPrice);\nconst orderQuantity = Number(receivedQuantity);\ntypeof orderPrice; // "number"\n${orderPrice} + ${orderPrice}; // ${orderPrice*2}`;el('conversion-note').textContent=`한 잔 ${won(orderPrice)} × ${orderQuantity}잔 = ${won(orderPrice*orderQuantity)}`;live(`Number("${incomingPrice}"); // ${orderPrice}`,'글자를 숫자로 변환했어요. 아직 결제 전이라 매출은 그대로예요.');});
el('settle-order').addEventListener('click',()=>{if(chapter!==2||!converted||settled)return;settled=true;const total=orderPrice*orderQuantity;cash+=total;sales+=orderQuantity;unlocked=3;el('settle-order').disabled=true;el('day2-done').hidden=false;el('day2-feedback').textContent=`✓ ${won(total)} 결제! 실제 누적 매출에 더했어요.`;live(`cash += ${orderPrice} * ${orderQuantity};`,`숫자로 계산해 매출에 ${won(total)}을 더했어요.`);render();});
el('inspect-empty').addEventListener('click',()=>{if(chapter!==3||emptyInspected)return;emptyInspected=true;el('inspect-empty').disabled=true;el('undefined-result').hidden=false;live('let pickupTime; // 값은 undefined','변수를 선언했지만 값을 아직 할당하지 않았어요.');});
el('pickup-form').addEventListener('submit',event=>{event.preventDefault();if(chapter!==3||!emptyInspected||pickupRecorded)return;const value=el('pickup-input').value;if(!/^\d{2}:\d{2}$/.test(value))return;pickupTime=value;pickupRecorded=true;el('pickup-input').disabled=true;el('pickup-form').querySelector('button').disabled=true;el('coupon-task').hidden=false;live(`pickupTime = ${JSON.stringify(pickupTime)};`,`undefined → "${pickupTime}" · 받은 시간을 문자열로 저장했어요.`);render();});
el('no-coupon').addEventListener('click',()=>{if(chapter!==3||!pickupRecorded||couponConfirmed)return;coupon=null;couponConfirmed=true;el('no-coupon').disabled=true;el('null-result').hidden=false;el('null-code').textContent='coupon = null;\ncoupon === null; // true';live('coupon = null;','확인 결과 쿠폰이 없다고 명시했어요. undefined와는 다른 값이에요.');render();});
el('complete-reservation').addEventListener('click',()=>{if(chapter!==3||!couponConfirmed||reservationComplete)return;reservationComplete=true;el('complete-reservation').disabled=true;el('all-done').hidden=false;el('day3-feedback').textContent=`✓ ${pickupTime} 픽업 · 쿠폰 미사용으로 예약 정보를 정리했어요!`;el('caption').textContent='예약 정보 정리 완료. 세 챕터를 모두 마쳤어요!';});
el('reset').addEventListener('click',()=>{if(confirm('세 챕터의 진행을 지우고 처음부터 시작할까요?'))location.reload();});
render();
