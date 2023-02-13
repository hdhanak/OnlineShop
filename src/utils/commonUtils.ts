import auth from '../middleware/auth'
import decryptedData from '../middleware/dec'
// const routeArray = (array_: any, prefix: any, isAdmin: Boolean = false) => {
// console.log(typeof(array_),'jj');

//     array_.forEach((route:any) => {
//         const path = route.path
//         const method = route.method as "get" || "post" || "delete" ||"patch"
//         const controller = route.controller
//         const isPublic = route.isPublic === undefined ? false:true
//         const isEncrypt = route.isEncrypt===undefined?false:true
//         let middleware = []
//         if(isEncrypt){
//             middleware.push(decryptedData)
//         }
//         if(!isPublic){
//             middleware.push(auth)
//         }
//         middleware.push(controller);
//         prefix[method](path, ...middleware);
//     });
// return prefix
// }

const routeArray = (array_: any, prefix: any, isAdmin: Boolean = false) => {
    // path: "", method: "post", controller: "",validation: ""(can be array of validation), 
    // isEncrypt: boolean (default true), isPublic: boolean (default false)
    
    

    array_.map((route: any) => {

        console.log(typeof(prefix),'p');        
        
        const method = route.method as "get" | "post" | "put" | "delete" | "patch";
        const path = route.path;
        const controller = route.controller;
        const validation = route.validation;
        let middlewares = []; 
        const isEncrypt = route.isEncrypt === undefined ? true : route.isEncrypt;
        const isPublic = route.isPublic === undefined ? false : route.isPublic;      
        
        // if (isEncrypt) {
        //     middlewares.push(decryptedData.DecryptedData)
        // }

       
            if(!isPublic){
                middlewares.push(auth)
           }

        if (validation) {

      if (Array.isArray(validation)) {
         middlewares.push(...validation);
      } else {
         middlewares.push(validation);
         }
         }
            
        middlewares.push(controller);
        console.log(...middlewares,'l');        
        prefix[method](path, ...middlewares);

    })

    return prefix;
}
export default routeArray
// array_.forEach((route: any) => {
//     const method = route.method as "get" | "post" | "put" | "delete" | "patch";
//     const path = route.path;
//     const controller = route.controller;
//     const validation = route.validation;
//     let middlewares = []; 
//     const isEncrypt = route.isEncrypt === undefined ? true : route.isEncrypt;
//     const isPublic = route.isPublic === undefined ? false : route.isPublic;
//     const skipComponentId = route.skipComponentId === undefined ? false : route.skipComponentId;
//     const isGuest = route.isGuest === undefined ? false : route.isGuest;
    
//     if (isEncrypt && !isAdmin) {
//         middlewares.push(decryptedData.DecryptedData);
//     }

//     if (!isPublic) {
//         middlewares.push(verifyToken.verifyToken);
//     }

//     if (isGuest) {
//         guestRoute.push(path)
//     }
//     middlewares.push(verifyToken.verifyGuestPath);

//     if (isAdmin) {
//         middlewares.push(verifyToken.isAdmin);
//     }
//     if (component && !skipComponentId) {
//         switch (component) {
//             case MicroComponent.BUSINESS:
//                 middlewares.push(BusinessValidation.hasBusinessValidation)
//                 break;
//             default:
//                 break;
//         }
//     }
//     if (validation) {
//         if (Array.isArray(validation)) {
//             middlewares.push(...validation);
//         } else {
//             middlewares.push(validation);
//         }
//     }
//     middlewares.push(controller);
//     prefix[method](path, ...middlewares);
// })

// return prefix;
// }