﻿using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace LerniaReact.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        const string SEARCH_KEY = "866595ff-a5c6-481b-8aca-4a055fb19824";
        const string DEVIATIONS_KEY = "";
        const string TRIP_KEY = "";
        const string REALTIME_KEY = "d90842cf-a47f-4d3d-a7c0-8a9243ff1ea4";

        [Route("search/{term}")]
        public async Task Search([FromRoute] string term)
        {
            await Query($"https://api.resrobot.se/v2/location.name?key={SEARCH_KEY}&input={term}&format=json");
        }

        [Route("deviations/{siteId}")]
        public async Task Deviations([FromRoute] int siteId)
        {
            await Query($"http://api.sl.se/api2/deviations.json?key={DEVIATIONS_KEY}&siteId={siteId}");
        }

        [Route("trip/{fromId}/{toId}/{includeRealtime}")]
        public async Task Trip([FromRoute] int fromId, [FromRoute] int toId, [FromRoute] bool includeRealtime)
        {
            await Query($"http://api.sl.se/api2/TravelplannerV3/trip.json?key={TRIP_KEY}&originId={fromId}&destId={toId}&searchForArrival=0&realtime={includeRealtime}");
        }

        [Route("realtime/{siteId}")]
        public async Task Realtime([FromRoute] int siteId)
        {
            await Query($"https://api.resrobot.se/v2/departureBoard?key={REALTIME_KEY}&id={siteId}&maxJourneys=10&format=json");
        }

        private async Task Query(string url)
        {
            using (var request = new HttpClient())
            {
                var stream = await request.GetStreamAsync(url);
                Response.ContentType = "application/json";
                await stream.CopyToAsync(Response.Body);
            }
        }
    }
}