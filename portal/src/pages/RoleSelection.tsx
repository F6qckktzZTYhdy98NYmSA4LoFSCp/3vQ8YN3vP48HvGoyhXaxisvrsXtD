import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleCard } from "../components/RoleCard";
import { allRoles } from "../data/roles";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { LoaderFill } from "@/components/animations/Loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { workerPostClientLog } from "@/api/workerPostClientLog";

export const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    workerPostClientLog({
      event_type: 'page_view',
      event_name: 'role_selection_page_load',
      event_data: {
        timestamp: new Date().toISOString(),
      }
    }).catch(console.error);
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = async () => {
    if (selectedRole !== null) {
      const selected = allRoles.find((role) => role.id === selectedRole);
      if (selected) {
        workerPostClientLog({
          event_type: 'page_view',
          event_name: 'role_selection_role_selected',
          event_data: {
            timestamp: new Date().toISOString(),
            roleTitle: selected.title
          }
        }).catch(console.error);
        navigate("/scenario", { state: { role: selected } });
      }
    }
  };

  // Get department roles (excluding CEO)
  const departments = {
    Operations: allRoles.filter((role) => role.department === "Operations"),
    Engineering: allRoles.filter((role) => role.department === "Engineering"),
    Finance: allRoles.filter((role) => role.department === "Finance"),
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoaderFill />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="h-full flex flex-col">
        <PageHeader
          title="Choose your NexusForge Industries Role"
          subtitle="Select a role to begin your training experience. The training experience will be tailored to your role and communication patterns (i.e., who you commonly interact with within the company and externally)."
        >
          <TooltipProvider>
            <Tooltip disableHoverableContent={selectedRole !== null}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleRoleSelect}
                  disabled={selectedRole === null}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg text-base font-medium
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-blue-600 transition-colors"
                >
                    Next
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>
                  Select a <b>Role</b> to continue.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </PageHeader>

        <div className="flex-1 p-8 pt-0">
          <div className="grid grid-cols-3 gap-x-8 h-full">
            {Object.entries(departments).map(([dept, roles]) => (
              <div key={dept}>
                <h2 className="text-xl font-semibold text-gray-800 text-center border-b border-gray-200 pb-2 mb-6">
                  {dept}
                </h2>
                <div className="grid auto-rows-fr gap-6">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-stretch">
                      <RoleCard
                        {...role}
                        selected={selectedRole === role.id}
                        onClick={() => setSelectedRole(role.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
