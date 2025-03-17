
// See https://www.jetbrains.com/help/youtrack/devportal-apps/apps-reference-http-handlers.html
exports.httpHandler = {
    endpoints: [
        {
            scope: 'user',
            method: 'GET',
            path: 'demo',
            handle: function handle(ctx) {
                ctx.response.json({test: true, scope: 'user', userName: ctx.user.name});
            }
        },
        {
            scope: 'global',
            method: 'GET',
            path: 'demo',
            handle: function handle(ctx) {
                const activeProjects = ctx.globalStorage.extensionProperties;

                ctx.response.json({
                    activeProjects: activeProjects,
                });
            }
        },
        {
            scope: 'global',
            method: 'POST',
            path: 'demo',
            handle: function handle(ctx) {
                const body = ctx.request.json();
                ctx.globalStorage.extensionProperties.activeProjects = body.activeProjects;

                // eslint-disable-next-line no-console
                console.log('Updated storage', body);

                ctx.response.json({receiveBody: body});
            }
        }
    ]
};

//this code is never used