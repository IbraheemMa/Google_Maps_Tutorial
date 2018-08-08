var countryISOMapping={AF:"AFG",AX:"ALA",AL:"ALB",DZ:"DZA",AS:"ASM",AD:"AND",AO:"AGO",AI:"AIA",AQ:"ATA",AG:"ATG",AR:"ARG",AM:"ARM",AW:"ABW",AU:"AUS",AT:"AUT",AZ:"AZE",BS:"BHS",BH:"BHR",BD:"BGD",BB:"BRB",BY:"BLR",BE:"BEL",BZ:"BLZ",BJ:"BEN",BM:"BMU",BT:"BTN",BO:"BOL",BA:"BIH",BW:"BWA",BV:"BVT",BR:"BRA",VG:"VGB",IO:"IOT",BN:"BRN",BG:"BGR",BF:"BFA",BI:"BDI",KH:"KHM",CM:"CMR",CA:"CAN",CV:"CPV",KY:"CYM",CF:"CAF",TD:"TCD",CL:"CHL",CN:"CHN",HK:"HKG",MO:"MAC",CX:"CXR",CC:"CCK",CO:"COL",KM:"COM",CG:"COG",CD:"COD",CK:"COK",CR:"CRI",CI:"CIV",HR:"HRV",CU:"CUB",CY:"CYP",CZ:"CZE",DK:"DNK",DJ:"DJI",DM:"DMA",DO:"DOM",EC:"ECU",EG:"EGY",SV:"SLV",GQ:"GNQ",ER:"ERI",EE:"EST",ET:"ETH",FK:"FLK",FO:"FRO",FJ:"FJI",FI:"FIN",FR:"FRA",GF:"GUF",PF:"PYF",TF:"ATF",GA:"GAB",GM:"GMB",GE:"GEO",DE:"DEU",GH:"GHA",GI:"GIB",GR:"GRC",GL:"GRL",GD:"GRD",GP:"GLP",GU:"GUM",GT:"GTM",GG:"GGY",GN:"GIN",GW:"GNB",GY:"GUY",HT:"HTI",HM:"HMD",VA:"VAT",HN:"HND",HU:"HUN",IS:"ISL",IN:"IND",ID:"IDN",IR:"IRN",IQ:"IRQ",IE:"IRL",IM:"IMN",IL:"ISR",IT:"ITA",JM:"JAM",JP:"JPN",JE:"JEY",JO:"JOR",KZ:"KAZ",KE:"KEN",KI:"KIR",KP:"PRK",KR:"KOR",KW:"KWT",KG:"KGZ",LA:"LAO",LV:"LVA",LB:"LBN",LS:"LSO",LR:"LBR",LY:"LBY",LI:"LIE",LT:"LTU",LU:"LUX",MK:"MKD",MG:"MDG",MW:"MWI",MY:"MYS",MV:"MDV",ML:"MLI",MT:"MLT",MH:"MHL",MQ:"MTQ",MR:"MRT",MU:"MUS",YT:"MYT",MX:"MEX",FM:"FSM",MD:"MDA",MC:"MCO",MN:"MNG",ME:"MNE",MS:"MSR",MA:"MAR",MZ:"MOZ",MM:"MMR",NA:"NAM",NR:"NRU",NP:"NPL",NL:"NLD",AN:"ANT",NC:"NCL",NZ:"NZL",NI:"NIC",NE:"NER",NG:"NGA",NU:"NIU",NF:"NFK",MP:"MNP",NO:"NOR",OM:"OMN",PK:"PAK",PW:"PLW",PS:"PSE",PA:"PAN",PG:"PNG",PY:"PRY",PE:"PER",PH:"PHL",PN:"PCN",PL:"POL",PT:"PRT",PR:"PRI",QA:"QAT",RE:"REU",RO:"ROU",RU:"RUS",RW:"RWA",BL:"BLM",SH:"SHN",KN:"KNA",LC:"LCA",MF:"MAF",PM:"SPM",VC:"VCT",WS:"WSM",SM:"SMR",ST:"STP",SA:"SAU",SN:"SEN",RS:"SRB",SC:"SYC",SL:"SLE",SG:"SGP",SK:"SVK",SI:"SVN",SB:"SLB",SO:"SOM",ZA:"ZAF",GS:"SGS",SS:"SSD",ES:"ESP",LK:"LKA",SD:"SDN",SR:"SUR",SJ:"SJM",SZ:"SWZ",SE:"SWE",CH:"CHE",SY:"SYR",TW:"TWN",TJ:"TJK",TZ:"TZA",TH:"THA",TL:"TLS",TG:"TGO",TK:"TKL",TO:"TON",TT:"TTO",TN:"TUN",TR:"TUR",TM:"TKM",TC:"TCA",TV:"TUV",UG:"UGA",UA:"UKR",AE:"ARE",GB:"GBR",US:"USA",UM:"UMI",UY:"URY",UZ:"UZB",VU:"VUT",VE:"VEN",VN:"VNM",VI:"VIR",WF:"WLF",EH:"ESH",YE:"YEM",ZM:"ZMB",ZW:"ZWE"};
var placeSearch, autocomplete,google_script_created=false;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    premise: 'long_name',
    administrative_area_level_2: 'long_name',
    postal_town: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};
function getCountryISO3(countryCode){
    return countryISOMapping[countryCode];
}
function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    var main_elm = document.getElementById('main_field');
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(main_elm),
        {types: ['geocode']});


    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    if(config.landSelectbox === true){
        componentForm.country = 'short_name';
    }else{
        componentForm.country = 'long_name';
    }

    for (var component in componentForm) {
        var elm = document.querySelector('.'+component);
        if(elm){
            elm.value = '';
            elm.disabled = false;
        }
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0],street_name,street_number;
        if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        var generalElm = document.querySelector('.'+addressType);
        // make street number and name in one filed
        if(config.addressOneFiled === true ){
            if(addressType === "route"||addressType === "premise"){
                street_name = val;
            }
            if(addressType === "street_number"){
                street_number = val;
            }
            if(street_name !== undefined && street_number !== undefined){
                document.querySelector('#main_field').value = street_name +" "+street_number;
            }       
        }
        // Case country field as selectbox
        if(addressType === "country" && config.landSelectbox === true){
            val = getCountryISO3(val);
            var selectedElmnt = document.querySelector(''+config.landSelectboxSelector+' [selected]');
            if(selectedElmnt){
                selectedElmnt.removeAttribute('selected');
            }
            document.querySelector(''+config.landSelectboxSelector+' [value="'+val+'"]').setAttribute('selected','');
        }
        if(generalElm){
            generalElm.value = val;
        }
        }
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
        });
    }
}

// Create 'script' element with the google api link
window.onload = function(){
if(config.apiKey === undefined || config.apiKey === ""){
    console.error("Please define 'apiKey' variable with valid key");
    return;
}
var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key="+config.apiKey+"&libraries=places&callback=initAutocomplete";
    script.setMultiAttribute({async:'',defer:''});
    document.body.appendChild(script);
}

// Method to add multiple attributes
// to add attributes use an object which object key would be 'attribute name' and the value 'attribute value'
// EXAMPLE: {href: "https://www.example.com", class: "button"}
Element.prototype.setMultiAttribute = function(obj){
for(var objKey in obj){
    this.setAttribute(objKey,obj[objKey]);
}
}