//se il form di login e il form di signin non sono visibili allora imposta la larghezza della sezione a sinistra della home su 100%
function checkPage2Content() {
  if ($("#login").css('display') === 'none' && $("#signin").css('display') === 'none') {
    $("#page1").animate({
      width: '100%'
    }, 600);
  }
}

//nasconde il primo form e fa apparire/sparire il secondo, successivamente verifica la visibilità dei due form
function toggleForm(id1, id2) {
  $("#" + id1).fadeOut('fast', function() {
    $("#" + id2).fadeToggle('fast', function() {
      checkPage2Content();
    });
  });
}

$(document).ready(function() {
  //quando l'evento open avviene il div status appare
  $('#status').bind('open', function() {
    $("#status").fadeIn('fast');
    $("#status").effect("shake", {
      direction: "left",
      times: 2,
      distance: 10
    }, 250);
  });

  //fa scomparire il div status al click su di esso
  $('#status').on('click', function() {
    $("#status").fadeOut('fast');
  });

  //permette di visualizzare i requisiti del campo passando con il mouse sopra all'icona
  $(".tooltip").hover(function() {
    $(this).next("div").fadeToggle("fast").css("display", "inline-block");
  });

  //alla pressione del pulsante accedi o registrati visualizza o nasconde il form corrispondente
  $("#action > a").on('click', async function triggerLoginForm() {
    $("#status").fadeOut('fast');
    //se la larghezza della sezione a sinistra della home è maggiore del 50% allora la imposta su 50%
    if (parseInt($("#page1").css('width')) > ($(window).width() / 2)) {
      $("#page1").animate({
        width: '50%'
      }, 600, () => {
        //verifica quale dei due pulsanti è stato cliccato
        if (this.getAttribute('id') === 'triggerLoginFormButton') {
          toggleForm("signin", "login");
        } else if (this.getAttribute('id') === 'triggerSigninFormButton') {
          toggleForm("login", "signin");
        }
      });
    } else {
      //verifica quale dei due pulsanti è stato cliccato
      if (this.getAttribute('id') === 'triggerLoginFormButton') {
        toggleForm("signin", "login");
      } else if (this.getAttribute('id') === 'triggerSigninFormButton') {
        toggleForm("login", "signin");
      }
    }
  });
});
