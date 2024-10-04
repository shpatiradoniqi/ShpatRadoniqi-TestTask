using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using ShpatRadoniqi_TestTask.Server.Models;

namespace ShpatRadoniqi_TestTask.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SvgDimensionsController : ControllerBase
    {
        private const string JsonFilePath = "rectangle.json";

        [HttpGet]
        public async Task<IActionResult> GetRectangleDimensions()
        {
            var json = await System.IO.File.ReadAllTextAsync(JsonFilePath);
            return Ok(JsonSerializer.Deserialize<RectangleDimensions>(json));
        }

        [HttpPost("validate-rectangle")]
        public async Task<IActionResult> ValidateRectangle([FromBody] RectangleDimensions dimensions)
        {
            await Task.Delay(10000); // Simulate 10 seconds of processing

            if (dimensions.Width > dimensions.Height)
            {
                return BadRequest(new { error = "Width cannot exceed height." });
            }

            return Ok();
        }

        [HttpPost("save-rectangle")]
        public async Task<IActionResult> SaveRectangleDimensions([FromBody] RectangleDimensions dimensions)
        {
            var json = JsonSerializer.Serialize(dimensions);
            await System.IO.File.WriteAllTextAsync(JsonFilePath, json);
            return Ok();
        }
    }
}
