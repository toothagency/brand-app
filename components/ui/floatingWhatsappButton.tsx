import React from 'react'

const FloatingWhatsappButton = () => {
  return (
    <div>
        
        {/* --- Floating WhatsApp Button --- */}
<a
  href="https://wa.me/237657884036?text=Hello%20Jara%20AI,%20I%20would%20like%20to%20learn%20more%20about%20your%20service."
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 z-50 group"
>
  <div className="w-16 h-16 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="white"
    >
      <path d="M12 2C6.486 2 2 6.037 2 11.023c0 1.938.623 3.774 1.792 5.336L2 22l5.824-1.733c1.488.814 3.16 1.242 4.861 1.242h.003C17.514 21.509 22 16.968 22 12.005 22 6.996 17.514 2 12 2zm5.042 14.029c-.208.583-1.232 1.154-1.695 1.207-.435.049-.992.069-1.598-.101-.368-.102-.84-.273-1.44-.534-2.519-1.098-4.155-3.632-4.281-3.804-.126-.173-1.02-1.358-1.02-2.59 0-1.232.645-1.84.873-2.09.227-.25.497-.313.664-.313.166 0 .332.002.478.009.153.007.358-.058.561.427.208.498.705 1.727.767 1.852.062.125.103.271.02.443-.083.173-.125.271-.25.417-.125.146-.263.327-.375.44-.125.125-.255.262-.11.514.146.25.647 1.068 1.39 1.729.955.848 1.76 1.112 2.012 1.237.251.125.397.104.542-.062.145-.167.625-.729.792-.979.167-.25.333-.208.561-.125.229.083 1.447.683 1.697.808.25.125.416.188.478.292.062.107.062.623-.146 1.207z"/>
    </svg>
  </div>
</a>
</div>
  )
}

export default FloatingWhatsappButton