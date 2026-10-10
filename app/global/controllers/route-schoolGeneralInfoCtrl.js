(function() {'use strict';angular.module('aesop')
.controller('SchoolGeneralInfoCtrl', function (stringSvc, schoolDetailsVal) {
// #-------------------------------------# //
// #------- SchoolGeneralInfoCtrl -------# //

    // this is a route controller
    var route = this;

    route.strings = stringSvc.getStrings([
        'GeneralInformation',
        'SchoolName',
        'ExternalNumber',
        'Address', 'City', 'Phone', 'State', 'Zip', 'Fax',
        'GetDirections'
    ]);

    // View Model properties
    route.vm = {
        institution: schoolDetailsVal,
        mapLink: mapLink()
    };

    function mapLink() {
        var mapBase = 'http://maps.google.com/maps?daddr=';
        if (!schoolDetailsVal.city || schoolDetailsVal.city === '' || !schoolDetailsVal.state || schoolDetailsVal.state === '') { return ''; }
        var addr = '';
        if (schoolDetailsVal.address1 && schoolDetailsVal.address1 !== '') {
            addr = addr + schoolDetailsVal.address1.replace(/\s/g, '+') + '+';
        }
        if (schoolDetailsVal.city && schoolDetailsVal.city !== '') {
            addr = addr + schoolDetailsVal.city.replace(/\s/g, '+') + '+';
        }
        if (schoolDetailsVal.state && schoolDetailsVal.state !== '') {
            addr = addr + schoolDetailsVal.state.replace(/\s/g, '+') + '+';
        }
        if (schoolDetailsVal.zip  && schoolDetailsVal.zip !== '') {
            addr = addr + schoolDetailsVal.zip.replace(/\s/g, '+') + '+';
        }
        return mapBase + addr;
    }

    // Actions that can be bound to from the view
    route.go = { };

// #----- END SchoolGeneralInfoCtrl -----# //
});}());