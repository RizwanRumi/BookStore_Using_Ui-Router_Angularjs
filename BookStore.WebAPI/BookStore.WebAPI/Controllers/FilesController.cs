using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace BookStore.WebAPI.Controllers
{
    public class FilesController : ApiController
    {

        public HttpResponseMessage Post()
        {

            HttpResponseMessage result = null;

            var httpRequest = HttpContext.Current.Request;

            if (httpRequest.Files.Count > 0)
            {

                string ImageName = ""; 

                foreach (string file in httpRequest.Files)
                {

                    var postedFile = httpRequest.Files[file];

                    var imgname = Path.GetFileName(postedFile.FileName);
                    var extension = Path.GetExtension(imgname);

                    Random _r = new Random();
                    var randomId = _r.Next();

                    string[] fileName = imgname.Split('.');

                    ImageName = fileName[0] + "_" + randomId + extension;



                    var filePath = HttpContext.Current.Server.MapPath("~/UploadImage/" + ImageName);

                    postedFile.SaveAs(filePath);                   

                }

                return Request.CreateResponse(HttpStatusCode.OK, ImageName);

            }

            else
            {

               return Request.CreateResponse(HttpStatusCode.BadRequest);

            }

           

        }



    }
}
