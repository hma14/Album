using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlbumServices.DTO
{
    public class ImageSmallDto
    {
        public int ImageId { get; set; }
        public byte[] ImageSmall { get; set; }
    }
}