import { Workflow } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { companyInfo } from "@/data/company";
import { styled } from "styled-components";
import { Tree, TreeNode } from 'react-organizational-chart';
import { workerPostClientLog } from "@/api/workerPostClientLog";

const StyledTree = styled(Tree)`
  width: 100%;
  text-align: center;

  .rst__lineHalfHorizontalRight::before,
  .rst__lineHalfHorizontalLeft::before,
  .rst__lineFullVertical::after {
    border-color: #E5E7EB !important;
  }

  .rst__lineChildren::after {
    background-color: #E5E7EB !important;
  }
`;

const StyledNode = styled.div`
  padding: 5px;
  display: inline-block;
`;

const NodeCard = ({ title, name, department = '' }: { title: string; name: string; department?: string }) => (
  <div className={`
    inline-flex flex-col items-center p-2 rounded-lg border
    ${department ? 'bg-blue-50/50 border-gray-200' : 'bg-blue-50 border-blue-100'}
  `}>
    <div className="font-semibold text-sm text-gray-800">{name}</div>
    <div className="text-xs text-gray-600">{title}</div>
    {department && <div className="text-xs text-gray-500 mt-0.5">{department}</div>}
  </div>
);

export function CompanyOrgChartModal() {
  const handleOpenChange = (open: boolean) => {
    if (open) {
      workerPostClientLog({
        event_type: 'modal_open',
        event_name: 'company_org_chart_modal_opened',
        event_data: {
          timestamp: new Date().toISOString(),
        }
      }).catch(console.error);
    }
  };

  return (
    <div className="fixed top-28 left-4 z-50">
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button 
              className="org-chart p-2 rounded-full  bg-blue-400 hover:bg-blue-600 transition-colors"
              title="Company Organization Chart"
            >
              <span className="sr-only">Company Organization Chart</span>
              <Workflow className="w-5 h-5 text-white" />
          </button>
        </DialogTrigger>
        <DialogContent className="min-w-[1000px]">
          <DialogHeader>
            <DialogTitle>{companyInfo.name}: Company Organization Chart</DialogTitle>
            <DialogDescription>
                <section>
                  <div className="org-tree py-12">
                    <StyledTree
                      lineWidth={'2px'}
                      lineColor={'#E5E7EB'}
                      lineBorderRadius={'4px'}
                      label={
                        <StyledNode>
                          <NodeCard
                            name={companyInfo.leadership.ceo.name}
                            title={companyInfo.leadership.ceo.title}
                          />
                        </StyledNode>
                      }
                    >
                      {companyInfo.leadership.directReports.map((executive, index) => (
                        <TreeNode
                          key={index}
                          label={
                            <StyledNode>
                              <NodeCard
                                name={executive.name}
                                title={executive.title}
                                department={executive.department}
                              />
                            </StyledNode>
                          }
                        >
                          {executive.reports.map((report, reportIndex) => (
                            <TreeNode
                              key={reportIndex}
                              label={
                                <StyledNode>
                                  <NodeCard
                                    name={report.name}
                                    title={report.title}
                                  />
                                </StyledNode>
                              }
                            />
                          ))}
                        </TreeNode>
                      ))}
                    </StyledTree>
                  </div>
                </section>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
