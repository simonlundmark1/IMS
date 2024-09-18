/* const express = require('express');

const router = express.Router();
/* const productModel = require ('./db/models/product')
const { createProduct } = require('../db/productCrud') */

const {
    findProduct,
    findProducts,
    createProducts,
    updateProducts,
    deleteProducts,
} = require("../db/productCrud");


// Define your routes here
//GET AIDS
router.get("/", async (req, res) => {
    const products = await findProducts();
    res.json(products);
});

//GET AIDS BY ID
router.get("/:id", async (req, res) => {
    const product = await findProduct(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).end();
    }
});

//POST AIDS
router.post("/", async (req, res) => {
    try {
        const newProduct = await createProducts(req.body);  // Create a new product
        res.status(201).json(newProduct);  // Respond with created product
    } catch (error) {
        res.status(400).json({ message: "DET ÄR ADIS"});  // Error handling for creation failures
    }
});


// UPDATE AIDS
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await updateProducts(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "AIDS not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//DELETE AIDS
router.delete("/:id", async (req, res) => {
    try {
        const deleteProduct = await deleteProducts(req.params.id);
        if (!deleteProduct) {
            return res.status(400).json({ error: "AIDS not found" });
        }
        res.json({ message: "AIDS deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET total AIDS value
router.get("/total-stock-value", async (req, res) => {
    try {
        const products = await findProducts();
        let totalValue = 0;
        products.forEach((product) => {
            totalValue += product.price * product.quantity;
        });
        res.json({ totalValue });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET total value of products in stock per manufacturer
router.get("/total-stock-value-by-manufacturer", async (req, res) => {
    try {
        const products = await findProducts();
        const manufacturers = {};

        products.forEach((product) => {
            if (manufacturers[product.manufacturer]) {
                manufacturers[product.manufacturer] += product.price * product.quantity;
            } else {
                manufacturers[product.manufacturer] = product.price * product.quantity;
            }
        });

        res.json(manufacturers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a list of all AIDS with less than 10 units in stock
router.get("/low-stock", async (req, res) => {
    try {
        const products = await findProducts();
        const lowStockProducts = products.filter((product) => product.quantity < 10);
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a compact list of AIDS with less than 5 items in stock
router.get("/critical-stock", async (req, res) => {
    try {
        const products = await findProducts();
        const lowStockProducts = products.filter((product) => product.quantity < 5);
        const compactProducts = lowStockProducts.map((product) => {
            return {
                manufacturer: product.manufacturer,
                contact: {
                    name: product.contact.name,
                    phone: product.contact.phone,
                    email: product.contact.email
                }
            };
        });
        res.json(compactProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve a list of all manufacturers-AIDS the company does business with
router.get("/manufacturers", async (req, res) => {
    try {
        const products = await findProducts();
        const manufacturers = new Set();

        products.forEach((product) => {
            manufacturers.add(product.manufacturer);
        });

        res.json(Array.from(manufacturers));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


/*

8b       d8 88,dPYba,,adPYba,   ,adPPYba, ,adPPYYba,  
`8b     d8' 88P'   "88"    "8a a8"     "" ""     `Y8  
 `8b   d8'  88      88      88 8b         ,adPPPPP88  
  `8b,d8'   88      88      88 "8a,   ,aa 88,    ,88  
    Y88'    88      88      88  `"Ybbd8"' `"8bbdP"Y8  
    d8'                                               
   d8'                                   
   
   It's the YMCA dance (y'know, to the chorus Y-M-C-A):

      \   / /V\   r _  / \
       \O/  \O/  /O/   \O/
        #    #    #     #
       / \  / \  / \   / \
      ^   ^^   ^^   ^ ^   ^

 */


 
/*            .                       
       |`.                     
       ;  `.                   
       ; :. \           __     
       ; ; \ \      .--"  \    
       ; ;  ; ;     :      \   
       ; ;  : :     ; ;     ;  
       ' :   ; ;    ;::     :  
        \ \  : ;--.-;; l     ; 
         \ \  ;:    :;//'-.__: 
         /\ \ ::____:::-\      
        /  ).:+'""""""""=\     
       :_,=""     /"-.    ;    
       ;"       .'    `.  |    
      :      .-^=    ==.\ |    
      |  _.-".gp      gp:;:    
      ;    /  $$      $$;: ;   
     :    :  `--      --:  |   
     ;    ;\        ,   '  |   
    :    :  \      _   /   :   
    ;    |   `.   `-' /     ;  
   :     :    :`-.__.'      |  
   ;          ;     :       |  
  :     ...._/      '.__..  |  
  ;   .'                  \ ;  
 :   /                   _ Y   
 ;  :         .g$$p.    d$$+.  
 ;  ;     :.g$$$$$$$$p.d$$$$$b 
 :  :     :$$$$$$$$$$$T$$$$$$$;
  \  ;    ;$$$$S$$$$$$$S$$$$$P 
   `.|    |$$$$S$$$$$$$S$$$$P  
     |    |T$$$$$SSSSS$$$$$$   
     :    | `T$$$$$$$$$$$$$;   
      ;   |   $$$$$$$$$$$$$    
      |   :   $$$$$$$$$$$$;    
      :    ; d$$$$$$$$$$$$;    
      |    :d$$$$$$$$$$$$$$    
      ;    :"^T$$$$$$$$$$$$b   
     :     ;   `T$$$$$$$$$$P;  
     ;    :      `T$$$$$$$P :  
     |    ;        T$$$$$P   ; 
     |   :          T$$P'    ; 
     :   ;           $'      : 
    ._;__;           :       : 
    ; ;  ;           |       : 
    :_L__:           |       ; 
    .'    ;          |       ; 
  .'      :          |      :  
 :/ _.-.  :;         |      |  
 /.'    \ |:         |      ;  
//  bug  ;| ;        |     :   
`        `' :        |     |   
             ;       |     ;   
             :       |    :    
              ;      |    |    
              :      :    ;    
              :    _.'-   ;    
              ;     /:    :    
             /     / ;     ;   
            /     :  ;     :   
           :      ;  ;     :   
           ;     :  :      :   
          :      ;  :      ;   
          ;     :   ;     :    
         :      ;   ;     ;    
         ;     :    ;    :     
         ;     ;    ;    ;     
         ;    :     ;   :      
         |    ;     ;   ;      
         |   :      ;  :       
         |   ;      ;  ;       
         :  :       :  ;       
         ;  :       :  :       
        :    ,      ;   ;      
        ;    ;      ;   :      
       :     :      :    ;     
       :     ;      :b__d$     
       $b   d$       $$$$$     
       :$bgd$;        T$P'     
        T$$$P               */

/*                      ,.'''''''''''..
                   ,..'               '..
                ,.'                      '.
              ,'                           '.
            ,'                               :
          ,'                                  :
        ,'                                     :
       ;                                        :
       ;                                        :
      ;                                 ..      ;
     ;                                 : \.    ;
    ;                                  :  `   ;
   :                                   :   | ;
   :                                  ;    | :
   :                                 ; ,---|  :
   :                                ;  [)_]'   :
   :                               ;      |    :
   :                          ,...'       |    ;
   :                   /|....:            '   ;
   :                  / | ::.      -  _  |    ;
   :                 /  | :.       ____  '  ,'
   ;                /   |  :    =-' __ ;|  :
  ;                /  ,'         `..__, |  :
  :               / ,'  `._          ,,'   :
  ;               |'    -''==:._____/      :
 ;                ;           `.        ,..;
 ;               ;              `.  ,..;
:               ;                `.'
:              ;                  |
:             ;                   |\
:           ,;                    , `.
:          ;/                         :.                ___________/__
:         ;/   /                       \`-.             \  kmr03 (_) /
:        : |  |                 /       \  `-.           \  hua  /  /
:        : |  |                '         `.   `-.         \  a  /  /
:        : |  |               |           |      `-.       \   /  /
:        : \ |                '_,-         |        \     ,-\__  /.
:         : \|               |             |         |   /    | \__)
:          : |               '             |         |  / _.-'| ,' )
 :          ;               |             /          ' /     ,|,_,'_
  :         |               '            /'         , /   ,'' |  |, )
   :        |              |          _ .'         , /   ` < ,|  (,'
    :       |              ' _,..---''_.._      ,-' /      _/______\_
     '.....|              |-' _,.--'''    `----'  ,'  `.       /
          _|              '--'               | ,-'         ,--'
        _:-|             |                   |/          ,'
       /' _|             '                   |         ,'
      | ,'|             |                    |       ,'
      | '_|             '                    :     ,'
       \__|            /                      :  ,'
         |            (                       |-'
         |             \                      :
         |              `.                     \
          \               `.                    \
           \                `.                   \ */

/*  ^\
           )\_
           |':";=,-`;,._
            \\         "._
 ^\         //            ";=,-._      ^\
  )\-._    ||         ;"._      "=.     )\
  //  ";=,-.\      ^\    ".       "`~,_.;/._
 ||         "=.     )\    ";-._,`~;._      ".
 \\           "`~,_.;/_                     ";,
  ||                  ".      ;"-._          "=._
  ||                   ";,        "-,           ";-,_
  //    ;"-._            "=.        ";:=.-,_         ";-._           ^\
 //         "-,            ";-,_           ":=;-,_.-";._ ";-._        )\
 \\           ";:=.-,_          ";-._    ^\            ";=._  "`~,;,_.'/
  \\                 ":=;-,_.-";._  ";="._)\               ";,-`~";=-.\\
   \\    "=.,_.;=._              ";=._   ";/                          //
    ||            ";:=,-'"=._             \\      _..-======-.._     //
    ||                      "`~.-=;",_."-. \\   .-              -.  //
    \\                                  _,.-\\"/.=._          _.=.\ ||
     \\  ;"~`._                      _.;"     /     =-.    .-=     \//
      \\      ";=,-`~._           _."        |   ,"="'.\  /,"="'.   |".,
       \\              ";=-.__,.-="":.        |  '.--.'|!!|'.--.'  |   ",`
        ||                _."          _.,"-=, '.      )!!(      .'      ;`.
        ||           _."=:".         _.'-."-=". ".    /-!!-\    ."       ";.
        \\    _.--==:;".    ".      .-":_:'" ". |'.   \U::U/   .'|       "-_
        _\\=:"=".       ".         -"_.-= `~;", \ /\_.-====-._/\ /        :,
     .'".'=\,.   ".                .'.'       ", ||  \/\/\/\/  ||         ,"
   .'         ".                   ".'            \\/\/\/\/\/\//           `,
  .'                              ".'            ;.\.=-.__.-=./           ."
 .'                              ;."            ,_: '-......-'";           ;
.'                               ;."           ,-"            :.          ;,
/.            ;.                 ;."          ,-=             ."_          )
.\             \                 ;."          ,"               ;.        _."
".              |                ;."          ,"             ,;         ,-;
";              |                ,;`          ,"       ,_;  ,"         ~,"
\,"             |                .,"          ,"      _.;'-=/          ;
 "_-            |                .,"          ,-:,.-=" ,-=:"         ."
 ,-:           /             _,.-=";          ;,      /_)\        _.=.
 ,;           |           _.-"     ;,         ".       _ /~";.:;="',;
 ,;           |=".-_,:;'-,"        ;.         ;,      ( / // // // /
  \           \|      ,;.          ",         '.       \_// // // /
  |           \         ".         /          ,;       ( / // /\_/
   |          ,;.         \       |;,`~ ;,'"-.L'        \_/\_/
  ,"             ". ,":.`~.\      .`.,' ;=.';. ".
  ;      -.=,":.`~.\\ \\ \\ \      "., ; = - `~\ \
  `.==--._ \\ \\ \\ \".`./;./       ". \\ \\ \\ \ \
          \,\\ \\ \\ \(_/(_/         ". \\ \\ \\ \/
          (_/"./`,/;./                `,.\\ \\ \\,\
            (_/(_/(_/                  '., \ \\ \`.'    LGB
                                           `." ` */

/*          .m.                                   ,_
         ' ;M;                                ,;m `
           ;M;.           ,      ,           ;SMM;
          ;;Mm;         ,;  ____  ;,         ;SMM;
         ;;;MM;        ; (.MMMMMM.) ;       ,SSMM;;
       ,;;;mMp'        l  ';mmmm;/  j       SSSMM;;
     .;;;;;MM;         .\,.mmSSSm,,/,      ,SSSMM;;;
    ;;;;;;mMM;        .;MMmSSSSSSSmMm;     ;MSSMM;;;;
   ;;;;;;mMSM;     ,_ ;MMmS;;;;;;mmmM;  -,;MMMMMMm;;;;
  ;;;;;;;MMSMM;     \"*;M;( ( '') );m;*"/ ;MMMMMM;;;;;,
 .;;;;;;mMMSMM;      \(@;! _     _ !;@)/ ;MMMMMMMM;;;;;,
 ;;;;;;;MMSSSM;       ;,;.*o*> <*o*.;m; ;MMMMMMMMM;;;;;;,
.;;;;;;;MMSSSMM;     ;Mm;           ;M;,MMMMMMMMMMm;;;;;;.
;;;;;;;mmMSSSMMMM,   ;Mm;,   '-    ,;M;MMMMMMMSMMMMm;;;;;;;
;;;;;;;MMMSSSMMMMMMMm;Mm;;,  ___  ,;SmM;MMMMMMSSMMMM;;;;;;;;
;;'";;;MMMSSSSMMMMMM;MMmS;;,  "  ,;SmMM;MMMMMMSSMMMM;;;;;;;;.
!   ;;;MMMSSSSSMMMMM;MMMmSS;;._.;;SSmMM;MMMMMMSSMMMM;;;;;;;;;
    ;;;;*MSSSSSSMMMP;Mm*"'q;'   `;p*"*M;MMMMMSSSSMMM;;;;;;;;;
    ';;;  ;SS*SSM*M;M;'     `-.        ;;MMMMSSSSSMM;;;;;;;;;,
     ;;;. ;P  `q; qMM.                 ';MMMMSSSSSMp' ';;;;;;;
     ;;;; ',    ; .mm!     \.   `.   /  ;MMM' `qSS'    ';;;;;;
     ';;;       ' mmS';     ;     ,  `. ;'M'   `S       ';;;;;
      `;;.        mS;;`;    ;     ;    ;M,!     '  luk   ';;;;
       ';;       .mS;;, ;   '. o  ;   oMM;                ;;;;
        ';;      MMmS;; `,   ;._.' -_.'MM;                 ;;;
         `;;     MMmS;;; ;   ;      ;  MM;                 ;;;
           `'.   'MMmS;; `;) ',    .' ,M;'                 ;;;
              \    '' ''; ;   ;    ;  ;'                   ;;
               ;        ; `,  ;    ;  ;                   ;;
                        |. ;  ; (. ;  ;      _.-.         ;;
           .-----..__  /   ;  ;   ;' ;\  _.-" .- `.      ;;
         ;' ___      `*;   `; ';  ;  ; ;'  .-'    :      ;
         ;     """*-.   `.  ;  ;  ;  ; ' ,'      /       |
         ',          `-_    (.--',`--'..'      .'        ',
           `-_          `*-._'.\\\;||\\)     ,'
              `"*-._        "*`-ll_ll'l    ,'
                 ,==;*-._           "-.  .'
              _-'    "*-=`*;-._        ;'
            ."            ;'  ;"*-.    `
            ;   ____      ;//'     "-   `,
            `+   .-/                 ".\\;
              `*" /                */ */