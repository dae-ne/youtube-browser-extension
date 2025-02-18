export const getDynamicRules = (id: number): chrome.declarativeNetRequest.UpdateRuleOptions => ({
    removeRuleIds: [id],
    addRules: [
        {
            id: id,
            priority: 1,
            action: {
                type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
                requestHeaders: [
                    {
                        header: 'user-agent',
                        operation: 'set' as chrome.declarativeNetRequest.HeaderOperation,
                        // eslint-disable-next-line max-len
                        value: 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 DMOST/2.0.0 (; LGE; webOSTV; WEBOS6.3.2 03.34.95; W6_lm21a;)'
                    }
                ]
            },
            condition: {
                resourceTypes: ['main_frame' as chrome.declarativeNetRequest.ResourceType],
                urlFilter: 'youtube.com/tv'
            }
        }
    ]
});
