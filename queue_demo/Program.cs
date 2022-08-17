using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace queue_demo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (!IsDevelopment())
            {
                // BuildWebHost(args).Run();
                CreateHostBuilder(args).Build().Run();
                // BuildWebHost(args).Build().Run();
            }
            else
            {
                // BuildWebHostDev(args).Run();
                CreateHostBuilderDev(args).Build().Run();
                // BuildWebHostDev(args).Build().Run();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
          webBuilder.UseStartup<Startup>();
        });

        public static IHostBuilder CreateHostBuilderDev(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureKestrel(serverOptions =>
                    {
                        if (IsDevelopment())
                        {
                            serverOptions.Listen(IPAddress.Loopback, 5000);
                            serverOptions.Listen(IPAddress.Loopback, 5001, listenOptions =>
                            {
                                // Fill this out with license information
                                listenOptions.UseHttps(@"C:\tmp\localhost.pfx", "password");
                            });
                        }
                    })
                    .UseStartup<Startup>();
                });
        
        public static bool IsDevelopment()
        {
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            return !string.IsNullOrEmpty(environment) && environment.Equals("Development");
        }
    }
}
