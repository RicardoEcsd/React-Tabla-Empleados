using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace apiEmpresa.Models
{
    public class Empleados_Bd
    {
        [Key]
        public int id { get; set; }
        public string  Nombre { get; set; }
        public int Edad { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string Area { get; set; }
    }
}
