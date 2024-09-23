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
  "BRL": {
    "cifrao": "R$",
    "pro": 25000,
    "vip": 50000
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
  "es": {
    "conta_real": "Cuenta real",
    "conta_real_mobile": "EN DIRECTO",
    "padrao": "estándar",
    "lucro_0": "beneficio +0%",
    "lucro_2": "beneficio +2%",
    "lucro_4": "beneficio +4%"
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
  let rankPos = 1;

  insertCustomCss();
  getMachineId();

  window.navigation.addEventListener("navigate", (event) => {
    lastURL = window.location.href;
  });

  getUser(async(items) => {
    if(items.user) {
      const interval = setInterval(function(){
        if((window.location.href === `/en/trade` || window.location.href === `/en/trade`) && lastURL != `/en/trade`) {
          window.location.href = `/en/trade`;
        }

        const balanceElement = document.body.querySelector('.usermenu__info-balance');
        if(!balanceElement) return;

        if(window.location.href === `/en/trade`) {
          history.pushState("Quotex: Uma plataforma inovadora para investimento online MKT", "Quotex: Uma plataforma inovadora para investimento online MKT", `/en/trade`);
          Array.from(document.querySelectorAll('.active')).forEach((el) => el.classList.remove('active'));
          Array.from(document.querySelectorAll('[href*="' + `/en/trade` + '"]')).forEach((el) => el.classList.add('active'));
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
          if(item.rankPos){
            rankPos = parseInt(item.rankPos);
          }
        });

        if(rankPos != 0 && headerName){
          headerName = headerName.cloneNode(true);
          const flag = headerName.firstChild.cloneNode(true);
          headerName.removeChild(headerName.firstChild);
          if(document.querySelector('.panel-leader-board__item-block svg')){
            document.querySelectorAll('.panel-leader-board__item-block')[rankPos - 1].querySelector('svg').replaceWith(flag);
          }
          if(document.querySelector('.position__expand')){
            document.querySelector('.position__expand').style.width = ((100 / 20) * (21 - rankPos)) + '%';
          }
          if(document.querySelector('.position__header-money') && document.querySelector('.panel-leader-board__item-money')){
            document.querySelector('.position__header-money').innerHTML = document.querySelectorAll('.panel-leader-board__item-money')[rankPos - 1].innerHTML;
          }
          if(document.querySelector('.panel-leader-board__item-name')){
            document.querySelectorAll('.panel-leader-board__item-name')[rankPos - 1].innerHTML = headerName.innerHTML;
          }
          if(document.querySelector('.position__footer')){
            const labelPos = document.querySelector('.position__footer').firstChild;
            document.querySelector('.position__footer').innerHTML = labelPos.outerHTML + rankPos;
          }
          if(document.querySelector('.panel-leader-board__item-avatar')){
            document.querySelectorAll('.panel-leader-board__item-avatar')[rankPos - 1].innerHTML = '<svg class="icon-avatar-default"><use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use></svg>';
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
          document.getElementsByClassName('usermenu__select-balance')[1].innerHTML = lanes[currency].cifrao + '10,000.00';
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
