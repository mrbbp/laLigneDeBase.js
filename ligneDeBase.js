/**
 * premier test lib de dessin d'une ligneDeBase sur le fond
 * ou le premier plan
 *
 * v.1 - 200601
 * mis en code par mrbbp.com
 *
 * 1  : version initiale
 *
 *  ligneDeBase.show(pattern,margin,level,style);
 *
 * pex: ligneDeBase.show(5,20,"up","dotted");
 *
 *
 * ou passage d'un objet contenant un ou plusieurs paramètres
 * ('color': couleur du dessin, paramètrable uniquement de cette façon)
 *
 *  p.ex.: const ldb = ligneDeBase.show({'pattern': 5,'style':'dotted', 'level':"down"});

 * si margin n'est pas définit, elle sera 2 fois la gouttiere (2*gap)
 *  margin: accepte String "8rem" (en rem) ou Chiffre (px)
 */
(function(root){ 
  'use strict';
  const settings = {
    'pattern': 5
    ,'size': 0
    ,'margin': 0
    ,'style' : 'dotted' // dashed dotted
    ,'level': "up"
    ,'color': 'rgba(0,176,228,.33)'
    ,'colorM': 'rgba(255, 100, 217,.66)'
    ,'debug':null
  };

  function ligneDeBase(){
    const _ligneDeBaseObject = {};
    // initialise le timer du resize
    window.resizeTimer;

    _ligneDeBaseObject.show = function(pa=5, ma=0, le="up", st="solid"){
       //console.log(m);

      // si c'est un objet (correctement formaté) il remplit les valeurs
      // sinon les valeurs par défaut sont écrites en premier
      if (typeof(pa) === 'object') {
        for (const i in pa) {
          settings[i] = pa[i];
        }
        settings['debug'] = typeof(pa['margin']);
        //pa['margin'].includes("rem");
        if(typeof(pa['margin']) === 'string') {
          // margin est une chaine -> donc pas en px mais en?
          if (pa['margin'].includes("rem")) {
            settings['margin'] = parseInt(pa['margin'].replace(/rem/g,''))*16;
          }
        }
      } else {
        settings.pattern = pa;
        settings.level = le;
        settings.margin = ma;
        settings.style = st;
      }
      const fs = window.getComputedStyle(document.body, null).fontSize;
      settings.fontSize = parseFloat(fs);
      if (settings.size == 0) {
        settings.size = parseFloat(fs)*1.2;
      }
      const lh = window.getComputedStyle(document.body, null).lineHeight;

      switch (typeof(parseFloat(lh))) {
        case 'string':
          //console.log("lh string",typeof(parseFloat(lh)),parseFloat(lh));
          break;
        case 'number':
          if (isNaN(parseFloat(lh))) {
            settings.lineHeight = parseFloat(fs)*1.2;
            //console.log("lh pas défini, utilise fs", fs, settings.lineHeight);
          } else {
            //console.log("lh Number",typeof(parseFloat(lh)),parseFloat(lh));
            settings.lineHeight = parseFloat(lh);
          }
          break;
      }

      dLdB();
      // renvoie settings pour debug
      return settings;
    };

    function dLdB() {
     // ajoute les styles pour avoir une hauteur de body
      document.querySelector("html").style.height = "100%";
      document.body.style.height = "100%";

      let c;
      root.largeur = document.body.clientWidth;
      root.hauteur = document.body.clientHeight;


     // si #ligneDeBase (canvas) existe, il le sélectionne, sinon l'ajoute au DOM
      if (document.querySelector("#ligneDeBase")) {
        c = document.querySelector("#ligneDeBase");
      } else {
        c = document.createElement("canvas");
        c.setAttribute("id", "ligneDeBase");
        c.setAttribute("style", "position: fixed; top:0; left:0;");
        document.body.insertBefore(c, document.body.firstChild);
        // en fonction de settings.level, place devant ou derrère
        if (settings.level == "down") {
          c.style.zIndex = -100;

        } else {
          c.style.zIndex = 100;
          //document.body.insertBefore(c, document.body.lastChild);
        }
      }
      // taille du canvas
      c.width = largeur;
      c.height = hauteur;
      const ctx = c.getContext('2d');
      ctx.lineWidth = .5;
      // efface le canvas
      ctx.clearRect(0, 0, largeur, hauteur);
      ctx.fillStyle = settings.colorM;
      // dessine les traits

      // trait exterieur gauche
      let compteur = 0;
      for (let i=settings.size+settings.margin; i< hauteur-settings.margin; i+= settings.size) {
        compteur++;
        // attribue les couleur en fonction du num du trait
        if (compteur%(settings.pattern)===0) {
          ctx.strokeStyle = settings.colorM;//'rgba(0,0,0,.50)';
        } else {
          ctx.strokeStyle = settings.color;//'rgba(0,0,0,.25)';
        }
        // gestion du style du tracé
        if (settings.style == "dashed") {
          ctx.setLineDash([4, 2]);
        } else if (settings.style == "dotted") {
          ctx.setLineDash([1, 2]);
        }
        // trace la ligne (au demi pixel pour avoir trait "crisp")
        ctx.beginPath();
        ctx.moveTo(0, Math.round(i)+.5);
        ctx.lineTo(largeur, Math.round(i)+.5);
        ctx.closePath();
        ctx.stroke();
      }
   }
   // gestion du resize avec délai
    window.addEventListener('resize', function(e) {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(function() {
        dLdB();
      }, 250);
    });

    return _ligneDeBaseObject;
  }
  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.ligneDeBase) === 'undefined'){
    window.ligneDeBase = ligneDeBase();
  }

})(window); // We send the window variable withing our function