types_input = [
    {"type": "text"},
    {"type": "hidden"},
    {"type": "email"},
    {"type": "password"},
    {"type": "url"},
    {"type": "number"},
    {"type": "tel"},
    {"type": "checkbox"},
    {"type": "radio"},
    {"type": "button"},
    {"type": "date"},
    {"type": "datetime-local"},
    {"type": "month"},
    {"type": "week"},
    {"type": "time"},
    {"type": "color"},
    {"type": "file"},
    {"type": "image"},
    //{"type": "search"},
    {"type": "range"},
    {"type": "reset"},
    {"type": "submit"},
]
info_saisie = {
    'input': 'Choisir le nom et le type de la donnée de ce champ',
    'label': 'Saisir le label ',
}
items_rep = null

$(document).ready(function () {


    //document.cookie = 'user2=Pierre2'; //Crée ou met à jour un cookie 'user'

    //console.log(document.cookie); //Affiche la liste des cookies
    //console.log("la div droite $(#droite).get() --> ", $("#droite").get())
    //console.log("la div droite html ", $("#droite").html())
    //console.log("la div droite text", $("#droite").text())

    $("#droite > button").each(function (index) {
        $(this).click(function () {
            //Ajout d'une zone pour saisir les information
            // utiles de la nouvelle balise du formulaire
            if ($("#zone_saisie").length == 0) {
                $("#droite").append(
                    '<div id="zone_saisie">' +
                    '<div id="div_info"></div>' +
                    '</div>'
                )
            }
            else {
                $("#zone_saisie").html('<div id="div_info"></div>')
            }

            //console.log('id du bouton choisi : ', $(this).attr('id'))

            //téléchargement d'un fichier texte contenant
            // les informations à afficher dans la zone infos
            // selon le choix du client

            //$("#div_info").load("doc/infos.txt ." + $(this).attr('id'), function (responseTxt, statusTxt, xhr) {
            $("#div_info").load("doc/infos.txt ." + $(this).attr('id'), function (responseTxt, statusTxt, xhr) {
                /*
                if (statusTxt == "success") {
                    console.log("Success: -" + xhr.status + "- External content loaded successfully!")
                    console.log("responseTxt: -" + $(this).attr('id') + "\n" + responseTxt)
                }
                /**/

                if (statusTxt == "error") {
                    console.log(
                        "Error: " + xhr.status + " : " + xhr.statusText +
                        '\nErreur du téléchargement du fichier contenant ' +
                        'les infos utiles pour créer ce formulair'
                    )

                    $.get( "doc/infos.txt", function( data ) {
                        $("#div_info").html( data );
                        alert( "succes data" );
                    });
                }
            })

            //ajout d'une zone de saisie pour créer une nouvelle balise
            $("#zone_saisie").append
            (
                '<p id="' + $(this).attr('id') + '"></p>' +
                '<label>' + (
                    //($(this).attr('id') =='input')
                    ($(this).text().includes('texte'))
                        ? 'Id de la '
                        : 'Text du '
                )
                + $(this).text() + '</label>' +
                '<input name="nom_balise" value="' + $(this).attr('id') + '" type="hidden" />' +
                '<input name="id" value="" type="text" required />' +
                '<button id="submit">valider </button>' +
                '<button id="annuler">annuler </button>'
            ).hide().fadeIn(1500, function () {
                $("#droite > button").attr('disabled', 'disabled')
            })
            //console.log(' $("#zone_saisie> button ") -> ' , $("#zone_saisie> button ").attr('id'))

            //Zones de saisie pour ajouter des attribues pour la balise <input>
            switch ($(this).attr('id')) {
                case 'input':
                    //$("#submit_button ").attr('id','test_input')
                    set_input($(this))
                    break
                //case 'autre_type_de balise':
                //    break;
                default:

                    break
            }

            //Validation de l'ajout de la  nouvelle balise
            $('#submit').click(function () {
                let valider = true   // variable de validation

                //Gestion des données saisies par le client
                $("#zone_saisie input").each(function (index) {

                    //Gestion des erreurs de validation

                    //données required
                    if ($(this).attr('required') && $(this).val().trim() == '') {
                        valider = false
                    }
                    /*
                    console.log('$(this).attr(name) : ', $(this).attr('name'))
                    console.log('$(this).val() : ', $(this).val())
                    console.log('items_rep ', items_rep)
                    /**/

                    //Initialisation d'une variable de type list pour les données saisies
                    if (items_rep == null) {
                        items_rep = []
                        items_rep['values'] = null
                    }
                    if ($(this).attr('name').includes('value_')) {
                        if (items_rep['values'] == null) {
                            items_rep['values'] = []
                            //console.log(' typeof items_rep[values] : ', typeof items_rep['values'])
                            //console.log('items_rep[values] : ', items_rep['values'])
                        }


                        items_rep['values'].push($(this).val())
                        //console.log("items_rep['values'] ; ", items_rep['values'])
                    }
                    else {
                        //console.log('typeof items_rep[$(this).attr(name)] ', typeof items_rep[$(this).attr('name')])
                        items_rep[$(this).attr('name')] = $(this).val()
                    }
                    //console.log('items_rep : ', items_rep)

                })

                //console.log('items_rep : ', items_rep)

                //Validation de la saisie
                if (valider) {
                    //cas d'une balise de type 'input'
                    if (items_rep['nom_balise'] == 'input') {
                        get_input(items_rep['id'], items_rep['input_type'], items_rep['values'])
                        $('input[type="range"]').on('input', function() {
                                var $set = $(this).val()
                                $(this).next().text($(this).val())
                        })
                    }
                    //Autres cas
                    else {
                        get_not_input(items_rep['nom_balise'], items_rep['id'])
                    }

                    //Suppression de la zone de saisie client
                    $("#zone_saisie").fadeOut(1500, function () {
                        items_rep = null
                        $('#zone_saisie').remove();
                        $('#droite > button').removeAttr('disabled');
                        console.log('$("#gauche form+button") : ',$("#gauche form+button").length, '-->',$("#gauche form+button"))
                        if($("#btn-code").length==0){
                            $("#gauche").append(
                                '<p id="btn-code"><button onclick="creer_formulaire()">Créer formulaire</button></p>')
                        }
                    })
                }
                //Cas d'une saisie non valide
                else {
                    $("#zone_saisie input[required]").css('background', 'rgba(255,0,0,.3)').css('border', '1rem solide red')
                }


            })

            //Supprission de la zone de saise par le client
            $('#annuler').click(function () {
                $("#zone_saisie").fadeOut(1500, function () {
                    items_rep = null
                    $('#zone_saisie').remove()
                    $('#droite > button').removeAttr('disabled')
                })


            })
        })

    })
})

//fonction pour ajouter une balise de type input dans le formulaire
function get_input(id, type, values) {
    //gestion des attribues
    let attribues_input = 'id="' + id.split(' ').join('_') +
        '" name="' + id.split(' ').join('_') +
        '" type="' + type + '"'
    switch (type) {
        case 'checkbox':
            attribues_input += ' style="width:1rem !important;min-width: 1rem;"'
            break;
        case 'radio':
            attribues_input += ' style="width:1rem !important;min-width: 1rem;"'
            break;
        case 'range':
            attribues_input += ' min="' + values[0] + '"' +
                ' max="' + values[1] + '"' +
                ' step="' + values[2] + '"' +
                ' value="' + (values.length == 4 ? values[3] : '') + '"'
            break;
        case 'image':
            attribues_input += ' src="' + values[0] +
                '" style="min-height: 5rem !important;max-width:50vw;"'
            break;
        case 'submit':
            attribues_input += 'value="' + id + '" style="max-width:30vw;display:block;"'
            break
        case 'reset':
            attribues_input += 'value="' + id + '" style="max-width:30vw;display:block;"'
            break
        default:
            attribues_input += 'value=""'
            break;
    }

    let new_balises = ''

    //Ajout de balises input de type 'checkbox' ou 'radio'
    if (['checkbox', 'radio'].includes(type)) {
        values.forEach(function (value) {
            new_balises = new_balises +
                '<br/><input ' + attribues_input +
                ' value="' + value + '"' +
                '" />'
            new_balises = new_balises +
                '<span>' + value + '</span>'
        })
    }

    //Ajout d'une balise input de type autre que 'checkbox' ou 'radio'
    else {
        new_balises = '<input ' + attribues_input + '/>' +
            ((type=='range')?'<output></output>':'')

    }


    console.log('new_balises : ', new_balises)
    $('#gauche >from').append(new_balises)

}

function get_not_input(type_block, text) {
    $('#gauche >from').append(
        ((type_block == "textarea")
                ? ''
                : '<br />'
        ) +
        '<' + type_block +
        ' name="' + text.split(' ').join('_') + '"' +
        (
            (type_block == "textarea")
                ? ' row=50 col=auto'
                : ''
        ) +
        '>' +
        ((type_block == "textarea")
                ? ''
                : text
        )
        + '</' + type_block + '>'
    )
}

//création de formulair Client pour l'ajout d'une balise
function set_input(new_balise) {
    let options_select = '\n';
    types_input.forEach(function (item) {
        //console.log(item.type)
        //console.log(options_select)
        options_select = options_select + '<option value="'
            + item.type + ((item.type == 'text') ? '" selected' : '"')
            + '>' + item.type + '</option>\n'
    })
    $("#submit").before(
        '<label>Type des données de la ' + new_balise.text() + ' </label>' +
        '<input name="input_type" value="text" type="hidden" />' +
        '<select id="select_input">' + options_select + '</select>'
    )
    $('#select_input').change(function () {
        if (['checkbox', 'radio', 'image', 'range'].includes($(this).val())) {
            if ($("#zone_values").length == 0) {
                $("#submit").before(
                    '<div id="zone_values">' +
                    '<label>la(les) valeur(s) de la selection ' + $(this).val() + '</label>' +
                    '</div>'
                )
            }
            else{
                $("#zone_values").html(
                    '<label>la(les) valeur(s) de la selection ' + $(this).val() + '</label>'
                )
            }

        }else{
            $("#zone_values").remove()
        }
        //console.log("selection $(this).val()",$(this).val())
        /*
        console.log("selection $(#zone_saisie > input[name$='type_input']).val()"
            ,$("#zone_saisie > input[name$='type_input']").val())
        console.log("selection $()",$("#zone_saisie > input[name='type_input']"))
        console.log("selection - .val()",$('[name$="type_input"]').val())
        */
        $('[name$="input_type"]').val($(this).val())
        console.log("selection + .val()", $('[name$="input_type"]').val())
        //les attribues pour le type 'checkbox' ou 'radio'
        if (['checkbox', 'radio'].includes($(this).val())) {
            $("#zone_values").append(
                '<input name="value_0" type="text" />' +
                '<button>ajouter une valeur</button>'
            )
            //ajouter une nouvelle zone de saisie pour le champ checkbox ou radio
            $("#zone_values button").click(function () {
                $("#zone_values button").before(
                    '<input name="value_' + $("#zone_values > input").length +
                    '" type="text" />'
                )
            })
        } else {
            //les attribues pour d'autres types
            switch ($(this).val()) {
                case 'range':
                    $("#zone_values").append(
                        '<label>la valeur min</label>' +
                        '<input name="value_min" type="number" value="" required />' +
                        '<label>la valeur max</label>' +
                        '<input name="value_max" type="number" value="" required />' +
                        '<label>la valeur du palier</label>' +
                        '<input name="value_step" type="number" value="" step ="0.1" required />' +
                        '<label>la valeur par défaut</label>' +
                        '<input name="value_default" type="number"  value="" step ="0.1" />'
                    )

                    break;
                case 'image':
                    $("#zone_values").append(
                        '<label>l\'url de l\'image</label>' +
                        '<input name="value_src" type="url" value="" required />'
                    )
                    break;
                default:
                    break;
            }

        }
    })
}

//fonction pour récuperer le formulaire en html
function creer_formulaire(){

    if($('#gauche pre').length ==0){
        $('#gauche').append(
            '<pre><code class="js"></code></pre>'
            //'<pre  class="brush: javascript"><code class="js"></code></pre>'
        )
    }else{
        $('#gauche pre').html('<code class="js"></code>')
    }

    $('#gauche code').text(
        $("from").html()
            .replace(/<br ?\/?>/g,'\n<br>')
            //.replace(/</g,'&lt;')
            //.replace(/&lt;br ?\/?>/g,'<br />&lt;br>')
    )
    console.log('jquery :', $("from").html())
    //console.log('(setArray($("from").html())) : ', setArray($("from").html()))

}

