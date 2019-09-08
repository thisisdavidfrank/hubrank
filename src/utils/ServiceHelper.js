class ServiceHelper {

    static getOrganizationRepos = function(organizationName, callbackFunction) {
        let url = 'https://api.github.com/orgs/'
                + organizationName
                + '/repos'
                + '?per_page=100';
        
        ServiceHelper.getRepos(url, [], callbackFunction);
    }

    static getRepos = function(url, data, callbackFunction) {
        fetch(url,
             {
                method: 'get',
                headers: new Headers({
                    'Accept': 'application/vnd.github.inertia-preview+json'
                }), 
             })
             .then((resp) => {
                 resp.json()
                     .then((jsonResp) => {
                         data = data.concat(jsonResp);
                         /*
                            GitHub's API returns data with pagination.
                            Thus, when there are several pages of data,
                            we need to get the repos from all of them
                            in order to be able to apply a proper sort.
                            Thus, we are checking for the 'Link' header,
                            extracting the url for the "next" page from
                            the 'Link' header value, and then recursively
                            calling the API until there are no more pages.
                         */
                         let link = resp.headers.get('Link');
                         if (link) {
                             let nextIndex = link.indexOf('>; rel="next"');
                             if (nextIndex > -1) {
                                 let url = link.substring(0, nextIndex).substring(1);
                                 ServiceHelper.getRepos(url, data, callbackFunction);
                             } else {
                                 callbackFunction(data);
                             }
                         } else {
                            callbackFunction(data);
                         }
                     });
                 
            });
    }

}

export default ServiceHelper;