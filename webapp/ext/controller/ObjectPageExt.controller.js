sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/BusyDialog",
    "sap/ui/core/HTML"
], function (Controller, MessageToast, MessageBox, Dialog, Button, BusyDialog, HTML) {
    'use strict';

    return {
        PrintPdf: function(oEvent) {
            var oContext = this.getView().getBindingContext();
            
            if (!oContext) {
                MessageToast.show("Contexte de l'équipement introuvable.");
                return;
            }

            const sEquipmentNumber = oContext.getProperty("Equipment");
            
            if (!sEquipmentNumber) {
                MessageToast.show("Numéro d'équipement non trouvé.");
                return;
            }

            // Indicateur de chargement
            var oBusyDialog = new BusyDialog({
                text: "Génération du PDF en cours...",
                title: "Veuillez patienter"
            });
            oBusyDialog.open();

            // URL complète du PDF
            var sPath = "/sap/opu/odata/sap/ZPM_PDF_GATEWAY_SRV/EquipPdfSet(Equnr='" + 
                        sEquipmentNumber + "')/$value";

            // Charger le PDF via XMLHttpRequest
            var xhr = new XMLHttpRequest();
            xhr.open("GET", sPath, true);
            xhr.responseType = "blob";
            xhr.withCredentials = true;

            xhr.onload = function() {
                oBusyDialog.close();
                
                if (xhr.status === 200) {
                    var blob = xhr.response;
                    
                    // Vérifier que c'est bien un PDF
                    if (blob.type !== "application/pdf" && blob.type !== "") {
                        // Si c'est une erreur XML
                        var reader = new FileReader();
                        reader.onload = function() {
                            MessageBox.error("Erreur du serveur:\n\n" + reader.result.substring(0, 500));
                        };
                        reader.readAsText(blob);
                        return;
                    }
                    
                    // Créer une URL pour le blob
                    var blobUrl = URL.createObjectURL(blob);
                    
                    // Créer le dialog de prévisualisation
                    var oPdfDialog = new Dialog({
                        title: "Aperçu - Fiche Équipement " + sEquipmentNumber,
                        contentWidth: "95%",
                        contentHeight: "95%",
                        draggable: true,
                        resizable: true,
                        content: [
                            new HTML({
                                content: 
                                    '<div style="width:100%; height:850px;">' +
                                    '<iframe src="' + blobUrl + '" ' +
                                    'width="100%" height="100%" ' +
                                    'style="border:none;"></iframe>' +
                                    '</div>'
                            })
                        ],
                        beginButton: new Button({
                            text: "Télécharger",
                            icon: "sap-icon://download",
                            type: "Emphasized",
                            press: function() {
                                // Télécharger le PDF
                                var link = document.createElement('a');
                                link.href = blobUrl;
                                link.download = "Fiche_Equipement_" + sEquipmentNumber + ".pdf";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                MessageToast.show("Téléchargement lancé");
                            }
                        }),
                        endButton: new Button({
                            text: "Fermer",
                            press: function() {
                                oPdfDialog.close();
                            }
                        }),
                        afterClose: function() {
                            // Nettoyer les ressources
                            URL.revokeObjectURL(blobUrl);
                            oPdfDialog.destroy();
                        }
                    });
                    
                    this.getView().addDependent(oPdfDialog);
                    oPdfDialog.open();
                    
                } else if (xhr.status === 404) {
                    MessageBox.error(
                        "PDF non trouvé pour l'équipement " + sEquipmentNumber + 
                        "\n\nVérifiez que le service est actif."
                    );
                } else {
                    MessageBox.error("Erreur HTTP " + xhr.status + ": " + xhr.statusText);
                }
            }.bind(this);

            xhr.onerror = function() {
                oBusyDialog.close();
                MessageBox.error("Erreur réseau lors de la récupération du PDF");
            };

            xhr.ontimeout = function() {
                oBusyDialog.close();
                MessageBox.error("La génération du PDF a pris trop de temps");
            };

            xhr.timeout = 30000; // 30 secondes
            xhr.send();
        }
    };
});