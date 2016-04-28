namespace AlbumServices.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Image
    {
        public int ImageId { get; set; }

        [Column(TypeName = "image")]
        public byte[] ImageSmall { get; set; }

        [Column(TypeName = "image")]
        public byte[] ImageLarge { get; set; }
    }
}
