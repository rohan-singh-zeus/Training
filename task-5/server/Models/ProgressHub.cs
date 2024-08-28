using Microsoft.AspNetCore.SignalR;

namespace server.Models
{
    public class ProgressHub : Hub
    {
        public async Task SendProgressUpdate(int percentage)
        {
            await Clients.All.SendAsync("ProgressUpdates", percentage);
        }
    }

}