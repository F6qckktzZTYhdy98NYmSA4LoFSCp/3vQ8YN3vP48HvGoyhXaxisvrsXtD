import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { companyInfo } from "@/data/company";
import { workerPostClientLog } from "@/api/workerPostClientLog";

export function CompanyOverviewModal() {

  const handleOpenChange = (open: boolean) => {
    if (open) {
      workerPostClientLog({
        event_type: 'modal_open',
        event_name: 'company_overview_modal_opened',
        event_data: {
          timestamp: new Date().toISOString(),
        }
      }).catch(console.error);
    }
  };

  return (
    <div className="fixed top-16 left-4 z-50">
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button 
            className="company-overview p-2 rounded-full bg-blue-400 hover:bg-blue-600 transition-colors"
            title="Company Overview"
          >
            <span className="sr-only">Company Overview</span>
            <Building2 className="w-5 h-5 text-white" />
          </button>
      </DialogTrigger>
      <DialogContent className="min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>{companyInfo.name}: Company Overview</DialogTitle>
          <DialogDescription>
            
          <section className="space-y-2">
                <p className="text-sm text-gray-600 leading-relaxed">{companyInfo.description}</p>
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-500">Founded:</span>
                  <span className="text-gray-700">{companyInfo.founded}</span>
                  <span className="text-gray-500 ml-4">HQ:</span>
                  <span className="text-gray-700">{companyInfo.headquarters}</span>
                </div>
              </section>
              <hr />
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">Products & Services</h2>
                <div>
                  <h3 className="text-base font-semibold text-gray-700">{companyInfo.products.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {companyInfo.products.mainDescription}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700">{companyInfo.products.keyProducts.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {companyInfo.products.keyProducts.description}
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-1">
                    {companyInfo.products.keyProducts.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="text-blue-500 flex-shrink-0">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-gray-600">
                  {companyInfo.products.customers}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  {companyInfo.products.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {photo.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    </div>
  );
}
