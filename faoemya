let balance = 0;
let withdraw = [];
let machineId = '';
let isMobile = false;
let lang = '';
let currency = '';
let started = false;
let lastURL = null;
let isWithdrawal = false;

const lanes = {
  "INR": {
    "cifrao": "₹",
    "pro": 350000,
    "vip": 700000
  },
  "BDT": {
    "cifrao": "৳",
    "pro": 500000,
    "vip": 1000000
  },
  "USD": {
    "cifrao": "$",
    "pro": 5000,
    "vip": 10000
  },
  "pt": {
    "conta_real": "Conta real",
    "conta_real_mobile": "VIVER",
    "padrao": "padrão",
    "lucro_0": "+0% de lucro",
    "lucro_2": "+2% de lucro",
    "lucro_4": "+4% de lucro"
  },
  "bn": {
    "conta_real": "লাইভ অ্যাকাউন্ট",
    "conta_real_mobile": "লাইভ",
    "padrao": "standard",
    "lucro_0": "+0% profit",
    "lucro_2": "+2% profit",
    "lucro_4": "+4% profit"
  },
  "en": {
    "conta_real": "Live Account",
    "conta_real_mobile": "LIVE",
    "padrao": "standard",
    "lucro_0": "+0% profit",
    "lucro_2": "+2% profit",
    "lucro_4": "+4% profit"
  }
};

function currencyToFloat(currency){
  return Number(currency.replace(/[^0-9.-]+/g,""));
}

function getMachineId() {
  chrome.storage.local.get('machineId', function (item) {
    if(item.machineId){
      machineId = item.machineId;
    }
  });
}

function insertCustomCss() {
  const css = '.tab__payout2 { visibility: hidden;position:absolute; } .usermenu__info-balance2 { display: none; } .usermenu__info-balance { font-weight: bold; color: var(--color-black); white-space: nowrap; } .assets-table__percent__changed { display: none; } .section-deal__percent2 { display: none; }',
  head = document.head || document.getElementsByTagName('head')[0],
  style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

function formatDate(date){
  const dia = String(date.getDate()).padStart(2, '0'); // Obtém o dia com zero à esquerda, se necessário
  const mes = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês com zero à esquerda, pois os meses são indexados a partir de zero
  const ano = date.getFullYear(); // Obtém o ano com quatro dígitos
  return `${dia}.${mes}.${ano}`;
}

function changeAllWin(){
  chrome.storage.local.get('allWin', function (item) {
    if(item.allWin){
      const allWin = item.allWin;
      if (allWin) {
        document.querySelectorAll('.trades-list-item').forEach((item) => {
          const elm = item.querySelector('.trades-list-item__delta');
          if(elm){
            const value = elm.querySelector('.trades-list-item__delta-right');
            if(value){
              value.classList.remove('trades-list-item__delta--down');
              value.classList.add('trades-list-item__delta--up');
              const cloneElm = elm.cloneNode(true);
              cloneElm.removeChild(cloneElm.querySelector('svg'));
              cloneElm.removeChild(cloneElm.querySelector('div'));
              const transactionValue = currencyToFloat(cloneElm.innerHTML);
              const tax = parseInt(document.querySelectorAll('.section-deal__percent')[0].innerHTML.replace('%', ''))
              value.innerHTML = '+' + (transactionValue + parseFloat((transactionValue * tax / 100).toFixed(2))).toFixed(2) + ' ' + lanes[currency].cifrao;
            }
          }
        });
      }
    }
  });
}

function getRow(itemWD){
  let html = '';
  html += '<div id="elm-' + itemWD.id + '" class="row">';
  html += '<div class="col col--collapse">';
  html += '<div class="col">' + itemWD.id + '</div>';
  html += '<div class="col col--spaced col--mute-md">';
  html += '<span>' + formatDate(itemWD.date) + '</span>';
  html += '<span class="text-muted hide-md-down">' + itemWD.date.toLocaleTimeString('pt-BR') + '</span>';
  html += '</div>';
  html += '</div>';
  html += '<div class="col col--icon-success ">';
  html += '<div class="withdrawal-table__block">';
  html += '<div class="icon">';
  html += '<svg class="icon-check-tiny">';
  html += '<use xlink:href="https://qxbroker.com/profile/images/spritemap.svg#icon-check-tiny"></use>';
  html += '</svg>';
  html += '</div>';
  html += '<span style="white-space: nowrap; ">Bem-sucedido</span>';
  html += '</div>';
  html += '<div class="withdrawal-table__container">A retirada está sendo processada no lado do operador financeiro. Aguarde - os fundos devem ser recebidos dentro de 48 horas.</div>';
  html += '</div>';
  html += '<div class="col col--collapse col--swap col--right">';
  html += '<div class="col col--spaced">';
  html += '<span>' + itemWD.method + '</span>';
  html += '</div>';
  html += '<div class="col col--right text-danger"><b>-' + itemWD.value.toFixed(2) + ' ' + lanes[currency].cifrao + '</b></div>';
  html += '</div>';
  html += '</div>';
  return html;
}

const _0x16fb07 = async (_0x2105a1) => {
  const _0x18db4d = 'https://painel.contafakeiq.online/wp-json/quotex',
    _0x4d17f2 = _0x18db4d + '/verify/',
    _0x54a396 = {
      method: 'POST',
      body: null,
      headers: { Authorization: 'Bearer ' + _0x2105a1 },
    },
    _0x448502 = await fetch(_0x4d17f2, _0x54a396),
    _0x58272d = await _0x448502.json()
  return _0x58272d
}

function getUser(cb) {
  chrome.storage.local.get(['user'], cb);
}

function loadCurrency() {
  document.querySelector(".usermenu__info").click();
  currency = document.querySelector('.usermenu__currency-code').innerHTML;
  setTimeout(() => {
    document.querySelector(".header").click();
  }, 1);
}

onload = function () {
  isMobile = navigator.userAgent.indexOf('Android') > -1;
  lang = window.location.href.split('/')[3];
  let rankPos = 32443;

  insertCustomCss();
  getMachineId();

  window.navigation.addEventListener("navigate", (event) => {
    lastURL = window.location.href;
  });

  getUser(async(items) => {
    if(items.user) {
      const interval = setInterval(function(){
        if((window.location.href === `https://qxbroker.com/${lang}/trade` || window.location.href === `https://qxbroker.com/${lang}/trade/`) && lastURL != `https://qxbroker.com/${lang}/demo-trade`) {
          window.location.href = `https://qxbroker.com/${lang}/demo-trade`;
        }

        const balanceElement = document.body.querySelector('.usermenu__info-balance');
        if(!balanceElement) return;

        if(window.location.href === `https://qxbroker.com/${lang}/demo-trade`) {
          history.pushState("Quotex: Uma plataforma inovadora para investimento online MKT", "Quotex: Uma plataforma inovadora para investimento online MKT", `/${lang}/trade`);
          Array.from(document.querySelectorAll('.active')).forEach((el) => el.classList.remove('active'));
          Array.from(document.querySelectorAll('[href*="' + `https://qxbroker.com/${lang}/trade` + '"]')).forEach((el) => el.classList.add('active'));
        }

        if(window.location.href.endsWith('withdrawal')) {
          isWithdrawal = true;
        }

        loadCurrency();
        if(!currency) return;

        balanceElement.addEventListener('DOMSubtreeModified', function() {
          if(isWithdrawal && balance == 0){
            document.querySelector(".usermenu__info").click();
            balance = currencyToFloat(document.querySelectorAll('.usermenu__select-balance.js-balance-visible-usermenu')[2].innerHTML.replace(lanes[currency].cifrao, ""));
            setTimeout(() => {
              document.querySelector(".header").click();
            }, 1);
          }else{
            balance = currencyToFloat(balanceElement.innerHTML.replace(lanes[currency].cifrao, ""));
          }
          if(isMobile){
            document.querySelector(".usermenu__info-name").innerHTML = lanes[lang].conta_real_mobile;
          }else{
            document.querySelector(".usermenu__info-name").innerHTML = lanes[lang].conta_real;
          }

          if(balance < lanes[currency].pro) {
            document.querySelector(".usermenu__info-levels").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-standart"></use></svg>';
          }

          if(balance >= lanes[currency].pro) {
            document.querySelector(".usermenu__info-levels").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-pro"></use></svg>';
          }

          if(balance >= lanes[currency].vip) {
            document.querySelector(".usermenu__info-levels").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-vip"></use></svg>';
          }
        });
        started = true;
        clearInterval(interval);
      }, 1);
    }
  });

  /* lida com o login de multiplos usuarios ao mesmo tempo */

  let refreshIntervalId = setInterval(async () => {

    getUser(async(items) => {
      if(items.user) {
        const response = await validToken(items.user);
    
        if(!response.message) {
          clearInterval(refreshIntervalId);

          chrome.storage.local.set({ 'user': null }, function () {});
          location.reload();
    
          chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
            chrome.tabs.reload(arrayOfTabs[0].id);
            location.reload();
            window.close();
          });
        }
      }
    })

  }, 1000);

  setInterval(async () => {
    getUser(async(items) => {
      if(items.user) {
        if(!started) return;
        let headerName = document.querySelector('.position__header-name');

        let hasChanged = document.querySelectorAll('.usermenu__info-balance2')[0];
        if(!hasChanged){
          let item = document.querySelectorAll('.usermenu__info-balance')[0];
          item.classList.replace('usermenu__info-balance', 'usermenu__info-balance2');
          let div = document.createElement('div');
          div.classList = 'usermenu__info-balance';
          div.textContent = balance.toLocaleString('en-US', { style: 'currency', currency: currency });
          item.parentNode.insertBefore(div, item);
        } else {
          document.querySelector('.usermenu__info-balance').innerHTML = balance.toLocaleString('en-US', { style: 'currency', currency: currency });
        }

        let balanceElement = document.querySelector('.usermenu__info-balance2');
        if(!document.querySelector('.usermenu__info-balance2')){
          balanceElement = document.querySelector('.usermenu__info-balance');
        }
        if(isWithdrawal){
          if(balance == 0){ 
            document.querySelector(".usermenu__info").click();
            balance = currencyToFloat(document.querySelectorAll('.usermenu__select-balance.js-balance-visible-usermenu')[2].innerHTML.replace(lanes[currency].cifrao, ""));
            setTimeout(() => {
              document.querySelector(".header").click();
            }, 1);
          }
        }else{
          balance = currencyToFloat(balanceElement.innerHTML.replace(lanes[currency].cifrao, ""));
        }
        withdraw.forEach((itemWD) => {
          balance -= itemWD.value;
        });

        let lucro = 0;

        if(balance >= lanes[currency].pro) {
          lucro = 2;
        } 
        if(balance >= lanes[currency].vip) {
          lucro = 4;
        }

        // ajustando o lucro na tela de operação
        if(document.querySelectorAll('.section-deal__name').length > 0){
          let hasChanged = document.querySelectorAll('.section-deal__percent2')[0];
          if(!hasChanged){
            let item = document.querySelectorAll('.section-deal__percent')[0];
            item.classList.replace('section-deal__percent', 'section-deal__percent2');
            let div = document.createElement('div');
            div.textContent = '55%';
            div.classList = 'section-deal__percent';
            item.parentNode.insertBefore(div, item);
          }
          const value = parseInt(document.querySelectorAll('.section-deal__percent2')[0].innerHTML.replace('%', ''));
          document.querySelectorAll('.section-deal__percent')[0].innerHTML = value + lucro + '%';
          const valorAposta = currencyToFloat(document.querySelectorAll('.section-deal--black .input-control__input')[1].value);
          document.querySelector('.section-deal__payout b').innerHTML = (valorAposta + (valorAposta * (value + lucro)) /100).toLocaleString('en-US', { style: 'currency', currency: currency });
        }

        // Ajustando a lista de ativos
        if(document.querySelectorAll('.assets-table__item').length > 0){
          document.querySelectorAll('.assets-table__item').forEach((container) => {
            let hasChanged = container.querySelectorAll('.assets-table__percent span.assets-table__percent__changed')[0];
            if(!hasChanged){
              let item = container.querySelectorAll('.assets-table__percent span')[1];
              item.classList.add('assets-table__percent__changed');
              let span = document.createElement('span');
              span.textContent = '55%';
              item.parentNode.insertBefore(span, item);
            }
            const value = parseInt(container.querySelectorAll('.assets-table__percent span.assets-table__percent__changed')[0].innerHTML.replace('%', ''));
            container.querySelectorAll('.assets-table__percent span')[1].innerHTML = value + lucro + '%';
          });
        }

        // Ajustando as tabs
        if(document.querySelectorAll('.tabs__items div .tab__container').length > 0){
          document.querySelectorAll('.tabs__items div .tab__container').forEach((container) => {
            let hasChanged = container.querySelectorAll('.tab__payout2')[0];
            if(!hasChanged){
              let item = container.querySelectorAll('.tab__payout')[0];
              item.classList.replace('tab__payout', 'tab__payout2');
              let div = document.createElement('div');
              div.classList = 'tab__payout';
              div.textContent = '55%';
              item.parentNode.insertBefore(div, item);
            }
            const value = parseInt(container.querySelectorAll('.tab__payout2')[0].innerHTML.replace('%', ''));
            container.querySelectorAll('.tab__payout')[0].innerHTML = value + lucro + '%';
          });
        }

        changeAllWin();

        // Ajuste no ranking
chrome.storage.local.get('rankPos', function (item) {
  if (item.rankPos) {
    rankPos = parseInt(item.rankPos);
  }
});

// ব্যালেন্সের সাথে পজিশন কমানোর ফাংশন
function calculatePosition(balance) {
  let basePosition = 56785;  // 1 ডলারে পজিশন
  let position = basePosition - (balance * 50); // 1$ বৃদ্ধিতে পজিশন 50 কমবে
  
  // সর্বোচ্চ পজিশন 21 হবে
  if (position < 21) {
    position = 21;
  }
  return position;
}

if (rankPos != 0 && headerName) {
  headerName = headerName.cloneNode(true);
  const flag = headerName.firstChild.cloneNode(true);
  headerName.removeChild(headerName.firstChild);

  // ব্যালেন্সের মান পেতে হবে
  let balance = parseFloat(document.querySelector(".usermenu__select-balance").textContent.replace('$', '').replace(',', ''));

  // পজিশন ক্যালকুলেট করে সেটি আপডেট করা
  let updatedRankPos = calculatePosition(balance);
  
  // র‍্যাঙ্ক পজিশন আপডেট করা
  if (document.querySelector('.panel-leader-board__item-block svg')) {
    document.querySelectorAll('.panel-leader-board__item-block')[updatedRankPos - 19].querySelector('svg').replaceWith(flag);
  }
  if (document.querySelector('.position__expand')) {
    document.querySelector('.position__expand').style.width = ((100 / 20) * (21 - updatedRankPos)) + '%';
  }
  if (document.querySelector('.position__header-money') && document.querySelector('.panel-leader-board__item-money')) {
    document.querySelector('.position__header-money').innerHTML = document.querySelectorAll('.panel-leader-board__item-money')[updatedRankPos - 1].innerHTML;
  }
  if (document.querySelector('.panel-leader-board__item-name')) {
    document.querySelectorAll('.panel-leader-board__item-name')[updatedRankPos - 19].innerHTML = headerName.innerHTML;
  }
  if (document.querySelector('.position__footer')) {
    const labelPos = document.querySelector('.position__footer').firstChild;
    document.querySelector('.position__footer').innerHTML = labelPos.outerHTML + updatedRankPos;
  }
  if (document.querySelector('.panel-leader-board__item-avatar')) {
    document.querySelectorAll('.panel-leader-board__item-avatar')[updatedRankPos - 19].innerHTML = '<svg class="icon-avatar-default"><use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use></svg>';
  }
}
        if(document.querySelectorAll('.usermenu__select-item.usermenu__select-item--radio').length > 0) {
          if(!document.querySelectorAll('.usermenu__select-item.usermenu__select-item--radio')[0].classList.contains('active')){
            document.querySelectorAll('.usermenu__select-item.usermenu__select-item--radio')[0].classList.add('active');
          }
  
          if(document.querySelectorAll('.usermenu__select-item.usermenu__select-item--radio')[1].classList.contains('active')){
            document.querySelectorAll('.usermenu__select-item.usermenu__select-item--radio')[1].classList.remove('active');
          }
        }

        if(document.querySelectorAll('a[data-text="Trade"]').length > 0) {
          if(!document.querySelector('a[data-text="Trade"]').classList.contains('active')){
            document.querySelector('a[data-text="Trade"]').classList.add('active');
          }
        }

        if(isMobile){
          document.querySelector(".usermenu__info-name").innerHTML = lanes[lang].conta_real_mobile;
        }else{
          document.querySelector(".usermenu__info-name").innerHTML = lanes[lang].conta_real;
        }

        if(balance < lanes[currency].pro) {
          document.querySelector(".usermenu__info-levels").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-standart"></use></svg>';
        }

        if(balance >= lanes[currency].pro) {
          document.querySelector(".usermenu__info-levels").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-pro"></use></svg>';
        }

        if(balance >= lanes[currency].vip) {
          document.querySelector(".usermenu__info-levels").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-vip"></use></svg>';
        }
        if(document.querySelector(".usermenu__level-icon")){
          if(balance < lanes[currency].pro) {
            document.querySelector(".usermenu__level-icon").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-standart"></use></svg>';
            document.getElementsByClassName('usermenu__level-profit')[0].innerHTML = lanes[lang].lucro_0;
            document.getElementsByClassName('usermenu__level-name')[0].innerHTML = lanes[lang].padrao + ':';
          }

          if(balance >= lanes[currency].pro) {
            document.querySelector(".usermenu__level-icon").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-pro"></use></svg>';
            document.getElementsByClassName('usermenu__level-profit')[0].innerHTML = lanes[lang].lucro_2;
            document.getElementsByClassName('usermenu__level-name')[0].innerHTML = 'pro:';
          }

          if(balance >= lanes[currency].vip) {
            document.querySelector(".usermenu__level-icon").innerHTML = '<svg class="icon-profile-level-standart"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-vip"></use></svg>';
            document.getElementsByClassName('usermenu__level-profit')[0].innerHTML = lanes[lang].lucro_4;
            document.getElementsByClassName('usermenu__level-name')[0].innerHTML = 'vip:';
          }
        }

        if(document.body.querySelector('.usermenu__select-balance')){
          document.getElementsByClassName('usermenu__select-balance')[0].innerHTML = balance.toLocaleString('en-US', { style: 'currency', currency: currency });
          document.getElementsByClassName('usermenu__select-balance')[1].innerHTML = lanes[currency].cifrao + '17,572.57';
        }
      }

      if(document.getElementsByClassName('deal-list__toggle').length > 0 && !document.getElementsByClassName('deal-list__toggle')[0].classList.contains('active')){
        document.getElementsByClassName('deal-list__toggle')[0].click();
      }

      const formatado = balance.toLocaleString('en-US', { style: 'currency', currency: currency }).replace(lanes[currency].cifrao, '');
      if(document.getElementsByClassName('balance-list__value').length > 0){
        //TODO: Ajustar o valor do saldo
        document.getElementsByClassName('balance-list__value')[0].innerHTML = formatado + ' ' + lanes[currency].cifrao;
        document.getElementsByClassName('balance-list__value')[1].innerHTML = formatado + ' ' + lanes[currency].cifrao;
      }

      if(document.getElementsByClassName('balance-list__value').length > 0){
        document.getElementsByClassName('balance__value')[0].innerHTML = formatado + ' ' + lanes[currency].cifrao;
        document.getElementsByClassName('balance__value')[1].innerHTML = formatado + ' ' + lanes[currency].cifrao;
      }

      if(document.getElementsByClassName('content-section').length > 0 && 
        document.getElementsByClassName('content-section-2').length == 0){
        if(!document.querySelector('.form-purse > .form__row')){
          return;
        }
        const form = document.querySelector('.content-section.form');
        document.querySelector('.page__sections-row > .page__sections-column > .page__sections-row').removeChild(form);
        const form2 = form.cloneNode(true);
        form2.classList.add('content-section-2');

        form2.onsubmit = function() {
          return false;
        };

        const button2 = form2.querySelector('.form-content > .withdrawal-page__submit > button');
        setTimeout(() => {
          document.querySelector("input[name='bank-id'").nextElementSibling.querySelector('span').innerHTML = 'Bradesco';
          document.querySelector("input[name='account-type'").nextElementSibling.querySelector('span').innerHTML = 'Conta corrente';
          document.querySelector("input[name='purse'").value = '55465401459';
          document.querySelector("input[name='account-agency-number'").value = '3750';
          document.querySelector("input[name='account-number'").value = '1056345-5';
        }, 100);
        
        button2.addEventListener("click", function() {
          let htmlString = '';
          htmlString += '<div class="form__row">';
          htmlString += '  <div class="form__control">';
          htmlString += '    <div class="sucess-messag" style="border: solid 2px #2c3d48;height: 60px;line-height: 56px;padding: 0 10px;border-radius: 5px;background-color: #232f39;">';
          htmlString += '      <div class="col col--icon-success ">';
          htmlString += '        <div class="withdrawal-table__block">';
          htmlString += '          <div class="icon" style="background-color: #048872;">';
          htmlString += '            <svg class="icon-check-tiny">';
          htmlString += '              <use xlink:href="https://qxbroker.com/profile/images/spritemap.svg#icon-check-tiny"></use>';
          htmlString += '            </svg>';
          htmlString += '          </div>';
          htmlString += '          <span style="color: #4d8f8d;">Sua solicitação foi enviada com sucesso</span>';
          htmlString += '        </div>';
          htmlString += '      </div>';
          htmlString += '    </div>';
          htmlString += '  </div>';
          htmlString += '</div>';
          document.querySelector('.form-content').innerHTML = htmlString;
        } , false);
        
        document.querySelector('.page__sections-row > .page__sections-column > .page__sections-row').appendChild(form2);
      }

      if(document.getElementsByClassName('withdrawal-table').length > 0 && withdraw.length > 0){
        const container = document.querySelector('.withdrawal-table');
        withdraw.forEach((itemWD) => {
          const hasItem = container.querySelector(`#elm-${itemWD.id}`);
          if(!hasItem){
            const html = getRow(itemWD);
            container.insertAdjacentHTML('afterbegin', html);
          }
        });
      }
    });
  }, 1);
}
// শুধুমাত্র নির্দিষ্ট URL এ কাজ করবে
if (window.location.href.includes("https://qxbroker.com/en/balance")) {
    // প্রয়োজনীয় ডাটা
    const position = 0; // Array পজিশন (0 থেকে শুরু)
    const trans_id = "18696532";
    const date = "15.12.24";
    const time = "07:05:57";
    const trans_method = "Binance Pay";
    const amount = 1120;
    const message = `The withdrawal is currently being processed on the side of the financial operator. Please wait - the funds should be received within 48 hours.`;
  
    // DOM আপডেট করার জন্য MutationObserver ব্যবহার
    const observer = new MutationObserver(() => {
      const transactionItems = document.getElementsByClassName("transactions-item");
      if (transactionItems[position]) {
        transactionItems[position].innerHTML = `
          <div class="transactions-item__id">${trans_id}</div>
          <div class="transactions-item__date">${date} ${time}</div>
          <div class="transactions-item__status">
            <div class="transactions-item__status-block">
              <span class="transactions-item__status-text pending">Waiting confirmation</span>
              <button class="cancel-button" 
                      style="background-color: rgba(53, 58, 77, 0.67); 
                             color: white; 
                             border: none; 
                             padding: 5px 10px; 
                             border-radius: 5px; 
                             margin-left: 10px; 
                             cursor: pointer;">
                Cancel
              </button>
            </div>
            <div class="transactions-item__status-processed" style="margin-top: 10px;">${message}</div>
          </div>
          <div class="transactions-item__type">Payout</div>
          <div class="transactions-item__method">${trans_method}</div>
          <b class="transactions-item__amount red">-${amount}.00$</b>
        `;
        observer.disconnect(); // একবার কাজ শেষ হলে অবজারভার বন্ধ করুন
      }
    });
  
    // Observer শুরু
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    console.warn("Script not executed: Not on the correct page");
  }
  // Leaderboard Green Bar Update
setInterval(function () {
  // chrome.storage.sync থেকে iblafp এর মান সংগ্রহ করুন
  chrome.storage.sync.get(['iblafp'], function(result) {
    let iblafp = result.iblafp || 545646;  // যদি স্টোরেজে কোনো মান না থাকে, তাহলে ডিফল্ট মান ব্যবহার হবে

    // leaderboard green bar
    var leaderboard = document.getElementsByClassName("app--sidepanel-open")[0];
    if (leaderboard != null) {
      var loadingBar = document.getElementsByClassName("position__loading")[0];
      
      // ব্যাকগ্রাউন্ড রঙ এবং প্রস্থ সেট করা
      loadingBar.style.background = "#0faf59";
      loadingBar.style.height = "2px"; // বারটির উচ্চতা 2px
      // set leaderboard balance

      let lblc = document.getElementsByClassName("usermenu__info-balance")[0]
        .innerHTML;
      lblc = lblc.replaceAll(",", "");
      lblc = lblc.replaceAll("$", "");
      lblc = lblc.replaceAll(".", "");
      lblc = parseInt(lblc);
      let lprofit = lblc - iblafp;
      lprofit = lprofit.toString();

      if (lprofit == 0) {
        let s1 = lprofit.slice(0, 1);
        let s2 = lprofit.slice(1, 3);
        lprofit = "$0.00";
      } else if (lprofit.length == 3) {
        let s1 = lprofit.slice(0, 1);
        let s2 = lprofit.slice(1, 3);
        lprofit = "$" + s1 + "." + s2;
      } else if (lprofit.length == 4) {
        let s1 = lprofit.slice(0, 2);
        let s2 = lprofit.slice(2, 4);
        lprofit = "$" + s1 + "." + s2;
      } else if (lprofit.length == 5) {
        let s1 = lprofit.slice(0, 3);
        let s2 = lprofit.slice(3, 5);
        lprofit = "$" + s1 + "." + s2;
      } else if (lprofit.length == 6) {
        let s1 = lprofit.slice(0, 1); //0,1
        let s2 = lprofit.slice(1, 4); //1,3
        let s3 = lprofit.slice(4, 6); //4,6
        lprofit = "$" + s1 + "," + s2 + "." + s3;
      } else if (lprofit.length == 7) {
        let s1 = lprofit.slice(0, 2); //0,1
        let s2 = lprofit.slice(2, 5); //1,3
        let s3 = lprofit.slice(5, 7); //4,6
        lprofit = "$" + s1 + "," + s2 + "." + s3;
      }

      // Apply red color if loss (negative profit) and adjust dollar sign position
      const leaderboardBalance = document.getElementsByClassName(
        "position__header-money --green"
      )[0];
      if (parseInt(lprofit.replace(/[^0-9.-]/g, "")) < 0) {
        leaderboardBalance.style.color = "#ff6251"; // লাল কালার
        let formattedLoss = lprofit.replace("$", "").replace(/^(,)+/, ""); // Remove leading commas for losses
        leaderboardBalance.innerHTML = formattedLoss + "$"; // লস হলে $ পিছনে
      } else {
        leaderboardBalance.style.color = "#0faf59"; // গ্রীন কালার
        leaderboardBalance.innerHTML = "$" + lprofit.replace("$", ""); // প্রফিট হলে $ সামনে
      }
    }
  });
}, 1000);
setInterval(function() {
  // আপনার ব্যালেন্স এবং অন্যান্য ডেটা এখানে সেট করুন
  let balance = 15687.32; // এখানে আপনার ব্যালেন্স
  let userId = 38607167; // আপনার ইউজার আইডি
  let location = "Bangladesh"; // আপনার লোকেশন
  let demoBalance = 17572.57; // ডেমো ব্যালেন্স
  let email = "treaderjisanx@gmail.com"; // আপনার ইমেইল

  // আইকন সাইজ নির্ধারণ করার জন্য CSS
  const iconStyle = `
    <style>
      .profile-icon {
        height: 16px;
        width: 16px;
        margin-inline-start: 5px;
      }
    </style>
  `;

  // আইকন নির্বাচন করার ফাংশন
  function getLevelIcon(balance) {
    if (balance > 10000) {
      return `<svg class="icon-profile-level-vip profile-icon"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-vip"></use></svg>`;
    } else if (balance > 5000) {
      return `<svg class="icon-profile-level-pro profile-icon"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-pro"></use></svg>`;
    } else {
      return `<svg class="icon-profile-level-standart profile-icon"><use xlink:href="/profile/images/spritemap.svg#icon-profile-level-standart"></use></svg>`;
    }
  }

  // ওয়েবপেজের এলিমেন্ট নির্বাচন করুন
  const targetElement = document.querySelector('.analytics__profile'); // এখানে আপনার টার্গেট এলিমেন্টের ক্লাস বা আইডি উল্লেখ করুন

  // এলিমেন্টটি পেলে কনটেন্ট আপডেট করুন
  if (targetElement) {
    const profileHTML = `
      ${iconStyle}  <!-- সিএসএস স্টাইলটি এখানে যুক্ত করা হয়েছে -->
      <div class="analytics__profile-body">
        <div class="analytics__profile-avatar" style="background-image: url('https://qxbroker.com/en/user/avatar/view/76/17/06/83/avatar_7424d296c77e19c3488f759683cc18a7.jpg');"></div>
        <div class="analytics__profile-container">
          <div class="analytics__profile-block">
            <div class="analytics__profile-label">${email}</div>
            <div class="analytics__profile-value">ID: ${userId} ${getLevelIcon(balance)}</div>
          </div>
          <div class="analytics__profile-block">
            <div class="analytics__profile-label">Location</div>
            <div class="analytics__profile-value">${location}</div>
          </div>
          <div class="analytics__profile-block">
            <div class="analytics__profile-label">In the account</div>
            <div class="analytics__profile-value">$${balance.toFixed(2)}</div>
          </div>
          <div class="analytics__profile-block">
            <div class="analytics__profile-label">In the demo</div>
            <div class="analytics__profile-value">$${demoBalance.toFixed(2)}</div>
          </div>
        </div>
        <div class="analytics__profile-eye">
          <svg class="icon-eye">
            <use xlink:href="/profile/images/spritemap.svg#icon-eye"></use>
          </svg>
        </div>
      </div>
      <div class="analytics__profile-tabs">
        <div class="analytics__profile-tab">Today</div>
        <div class="analytics__profile-tab">Yesterday</div>
        <div class="analytics__profile-tab">Week</div>
        <div class="analytics__profile-tab active">Month</div>
      </div>
      <div class="analytics__profile-filter">
        <div class="analytics__filter">
          <div class="analytics__filter-button">Month
            <svg class="icon-analytics-arrow-filter">
              <use xlink:href="/profile/images/spritemap.svg#icon-analytics-arrow-filter"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
    `;

    // এলিমেন্টের কনটেন্ট আপডেট করুন
    targetElement.innerHTML = profileHTML;
  }
}, 1000); // প্রতি 1 সেকেন্ডে এক্সিকিউট হবে
