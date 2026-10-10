const fixtureFactory = require('../helpers/fixtureHelper');
const RelatedConfs = require('../fixtures/AbsView/RelatedConf');
const RelatedFiles = require('../fixtures/AbsView/RelatedFiles');
const AccountingCodes = require('../fixtures/RptFilterData/AccountingCodes');
const AbsFiles = require('../fixtures/AbsView/AbsFiles');
const AbsenceReasons = require('../fixtures/AbsView/AbsenceReasons');
const AbsenceRequestView = require('../fixtures/AbsView/AbsView');
const BudgetCodes = require('../fixtures/RptFilterData/BudgetCodes');
const PayCodes = require('../fixtures/RptFilterData/PayCodes');
const AbsenceLogData = require('../fixtures/AbsView/AbsenceLog')
const Approvers = require('../fixtures/AbsView/Approvers');
const VacancyProfileList = require('../fixtures/VacancySelect/VacancyProfileList');
const AbsenceRequestData = require('../fixtures/VacancyView/AbsenceRequestData');
const BlankAbsFiles = require('../fixtures/VacancyView/AbsFiles');
const BlankAbsReasons = require('../fixtures/VacancyView/AbsReasons');
const AbsenceRequestWorkerData = require('../fixtures/AbsCreateDetails/AbsenceRequestWorkerData');
const AltAccountingCodeList = require('../fixtures/AbsCreateDetails/AccountingCodes');//contains a private accounting code
const AbsenceReasonsList = require('../fixtures/AbsCreateDetails/AbsenceReasonsList');
const AbsenceWorkerData = require('../fixtures/AbsView/AbsenceWorkerData');
const LockedAbs = require('../fixtures/AbsView/LockedAbs');
const SecondRelatedConf = require('../fixtures/AbsView/RelatedConf');
const AbsenceView = require('../fixtures/AbsView/AbsView');
const NewAbsSummary = require('../fixtures/AbsCreateDetails/NewAbsSummary');
const AbsCreateDone = require('../fixtures/AbsCreateDetails/AbsCreateDone');


const fixture = (cy) => {


    const mockAbsenceView = (overrideAbsrId, isLocked) => {

        //cy.server();

        var absrId = !!overrideAbsrId ? overrideAbsrId : 224976352;

        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/' + absrId + '?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
            response: AbsenceRequestView(absrId, isLocked)
        })
        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/' + absrId + '/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
            response: RelatedConfs()
        })
        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/' + absrId + '/Files',
            response: AbsFiles()
        })
        cy.route({
            method: 'GET',
            url: 'api/v1.0/workers/8323397/RelatedFiles?asOfDate=01/11/2018',
            response: RelatedFiles()
        })
        cy.route({
            method: 'GET',
            url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=5408&workId=8323397',
            response: AccountingCodes()
        })
        cy.route({
            method: 'GET',
            url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=5408&isVacancyType=false&workId=8323397',
            response: AbsenceReasons()
        })
        cy.route({
            method: 'GET',
            url: '/api/v1.0/budgetcodes',
            response: BudgetCodes()
        })
        cy.route({
            method: 'GET',
            url: '/api/v1.0/paycodes',
            response: PayCodes()
        })
        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/' + absrId + '/AbsenceLog',
            response: AbsenceLogData()
        })
        cy.route({
            method: 'GET',
            url: 'api/v1.0/absencerequests/' + absrId + '/Approvers',
            response: Approvers()
        })


    };

    const mockVacancyView = (overrideAbsrId, isLocked) => {

        //cy.server();

        var absrId = !!overrideAbsrId ? overrideAbsrId : 224980405;

        cy.route({
            method: 'GET',
            url: '/api/v1.0/workers?fields=(id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)&includeVacancies=true&includeWorkers=false&lastName=&maxRecords=100&offSet=0',
            response: VacancyProfileList()
        });
    
        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/' + absrId + '?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
            response: AbsenceRequestData()
        })
    
        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/' + absrId + '/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
            response: RelatedConfs()
        })
    
        cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/' + absrId + '/Files',
            response: BlankAbsFiles()
        })
    
        cy.route({
            method: 'GET',
            url: 'api/v1.0/workers/7083803/RelatedFiles?asOfDate=02/22/2018',
            response: RelatedFiles()
        })
    
        cy.route({
            method: 'GET',
            url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=5407&isVacancyType=true&workId=7083803',
            response: BlankAbsReasons()
        })
    
        cy.route({
            method: 'GET',
            url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=5407&workId=7083803',
            response: AccountingCodes()
        })
    
        cy.route({
            method: 'GET',
            url: '/api/v1.0/budgetcodes',
            response: BudgetCodes()
        })
    
        cy.route({
            method: 'GET',
            url: '/api/v1.0/paycodes',
            response: PayCodes()
        })


    }

    const mockAbsCreateDetails = (overrideAbsrId, isLocked) => {
    
            //cy.server();

            var absrId = !!overrideAbsrId ? overrideAbsrId : 224980405;
    
            cy.route({
              method: 'GET',
              url: '/api/v1.0/budgetcodes',
              response: BudgetCodes()
            })
      
            cy.route({
              method: 'GET',
              url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=147026&isVacancyType=false&workId=4628277',
              response: AbsenceReasonsList()
            })
        
            cy.route({
              method: 'GET',
              url: '/api/v1.0/paycodes',
              response: PayCodes()
            })
      
            cy.route({
              method: 'GET',
              url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=147026&workId=4628277',
              response: AltAccountingCodeList()
            })
          
            cy.route({
              method: 'GET',
              url: '/api/v1.0/AbsenceRequests/Context?workerid=4628277',
              response: AbsenceRequestWorkerData()
            })
        
            cy.route({
              method: 'GET',
              url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
              response: RelatedFiles()
            })
    
    
        }

    const mockRelatedLockedAbsView = (overrideAbsrId, isLocked) => {
    
            //cy.server();

            var absrId = !!overrideAbsrId ? overrideAbsrId : 224980405;

            cy.route({
                method: 'GET',
                url: '/api/v1.0/workers/8323397?fields=(isVacancy,id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)',
                response: AbsenceWorkerData()
                })

            cy.route({
                method: 'GET',
                url: '/api/v1.0/absencerequests/224976352?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
                response: AbsenceView()
                })

            cy.route({
                method: 'POST',
                url: '/api/v1.0/absencerequests/0/Lock',
                response: LockedAbs()
                })

            cy.route({
                method: 'POST',
                url: '/api/v1.0/absencerequests/224976352/Lock',
                response: LockedAbs()
                })

            cy.route({
                method: 'GET',
                url: '/api/v1.0/absencerequests/224976352/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
                response: SecondRelatedConf()
                })

            }
    const mockAbsRelatedFiles = () => {

            //cy.server()

            cy.route({
                method: 'GET',
                url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
                response: RelatedFiles()
            })
        }

    const mockAccountingCodeCall =() => {
            //cy.server()

            cy.route({
                method: 'GET',
                url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=147026&workId=4628277',
                response: AccountingCodes()
            })

        }

    const mockWorkerDataAndRelatedFilesCalls =() => {
            //cy.server();
            cy.route({
            method: 'GET',
            url: '/api/v1.0/AbsenceRequests/Context?workerid=4628277',
            response: AbsenceRequestWorkerData()
            })
        
            cy.route({
            method: 'GET',
            url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
            response: RelatedFiles()
            }) 

        }

    const mockAbsDoneCall =() =>{
            //cy.server();

            cy.route({
            method: 'POST',
            url: 'api/v1.0/absencerequests?numVacancies=1&reconcileMode=false',
            response: AbsCreateDone()
            });
        
            cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/224979559?accountingCodeData=true&approvalCommentData=true&feedbackTotalData=true&timesheetData=true',
            response: NewAbsSummary()
            });
        
            cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/224979559/Related?fields=id,created,startDate,endDate,worker,substitute,absences,closedDayAbsences,deletedAbsences,isCancelled,isClosed,lastUpdated,isDeleted,isLocked',
            response: {"data":[],"messages":[],"success":true,"modelState":{}} ,
            })
        
            cy.route({
            method: 'GET',
            url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
            response: RelatedFiles()
            }) 
        
            cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/224979559/Files',
            response: {"data":[],"messages":[],"success":true,"modelState":{}} 
            })
      
            cy.route({
            method: 'GET',
            url: '/api/v1.0/absencerequests/224979559/Approvers',
            response: Approvers()
            })

        }

    const mockDirAbsCreateDetails = () =>{

        cy.route({
            method: 'GET',
            url: '/api/v1.0/workers/4628277?fields=(isVacancy,id,firstName,lastName,identity,phone,title,institution(id),accountingCode,budgetCode,workerType(title),needFulfilment)',
            response:{"data":[{"isVacancy":false,"id":4628277,"firstName":"Joshua","lastName":"Alexander","identity":"MV124321","phone":"(210) 212-2122","title":null,"institution":[{"id":147026}],"accountingCode":null,"budgetCode":null,"workerType":{"title":"Teacher"},"needFulfilment":2}],"messages":[],"success":true,"modelState":{}}
          })
          
            cy.route({
            method: 'GET',
            url: '/api/v1.0/accountingcodes?enforceMultiLocPerm=true&fields=(id,name)&instId=147026&workId=4628277',
            response: AccountingCodes()
          })
      
          cy.route({
            method: 'GET',
            url: '/api/v1.0/budgetcodes',
            response: BudgetCodes()
          });
      
          cy.route({
            method: 'GET',
            url: '/api/v1.0/AbsenceReasons?enforceMultiLocPerm=true&fields=(id,name,notesToAdminRequired)&instId=147026&isVacancyType=false&workId=4628277',
            response: AbsenceReasonsList()
          });
      
          cy.route({
            method: 'GET',
            url: '/api/v1.0/paycodes',
            response: PayCodes()
          });
        
          cy.route({
            method: 'GET',
            url: '/api/v1.0/AbsenceRequests/Context?workerid=4628277',
            response: AbsenceRequestWorkerData()
          });
      
          cy.route({
            method: 'GET',
            url: /\/api\/v1.0\/workers\/\d+\/RelatedFiles\?asOfDate\=.*/,
            response: RelatedFiles()
          });  
    }

    return {
        mockAbsenceView,
        mockVacancyView,
        mockAbsCreateDetails,
        mockRelatedLockedAbsView,
        mockAbsRelatedFiles,
        mockAccountingCodeCall,
        mockWorkerDataAndRelatedFilesCalls,
        mockAbsDoneCall,
        mockDirAbsCreateDetails,
    };

};


module.exports = fixture;