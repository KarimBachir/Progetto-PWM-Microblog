//funzione wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

//imposta la larghezza della sezione a sinistra della home
function setPage1Width(width) {
  $("#page1").css('width', width);
};

//se il form di login e il form di signin non sono visibili allora imposta la larghezza della sezione a sinistra della home su 100%
function checkPage2Content() {
  if ($("#login").css('display') === 'none' && $("#signin").css('display') === 'none') {
    document.getElementById("status").innerHTML = '';
    setPage1Width('100%');
  }
};

$(document).ready(function() {
  $(".tooltip").hover(function() {
    $(this).next("div").fadeToggle("fast").css("display", "inline-block");
  });
  //fa apparire o sparire il form di login alla pressione del tasto accedi
  $("#action > a").on('click', async function triggerLoginForm() {
    $("#status").fadeOut('fast');
    //se la larghezza della sezione a sinistra della home è 100% allora la imposta a 50%
    if ($("#page1").css('width') === $(window).width() + 'px') {
      setPage1Width('50%');
      await sleep(600);
    }

    if (this.getAttribute('id') === 'triggerLoginFormButton') {
      //nasconde il form di signin e fa apparire-sparire quello di login, successivamente verifica la visibilità dei due form
      $("#signin").fadeOut('fast', function() {
        $("#login").fadeToggle('fast', function() {
          checkPage2Content()
        });
      });
    } else if (this.getAttribute('id') === 'triggerSigninFormButton') {
      //nasconde il form di login e fa apparire-sparire quello di signin, successivamente verifica la visibilità dei due form
      $("#login").fadeOut('fast', function() {
        $("#signin").fadeToggle('fast', function() {
          checkPage2Content()
        });
      });
    }
  });

});
