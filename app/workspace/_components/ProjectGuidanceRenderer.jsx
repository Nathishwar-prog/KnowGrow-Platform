"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Badge } from "../../../@/components/ui/badge";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { 
  Target, Clock, Code, BookOpen, CheckCircle, AlertTriangle, 
  Lightbulb, Rocket, ExternalLink, Database, Layout, Server,
  ChevronRight, Star, Zap, BookMarked
} from "lucide-react";
import CustomSyntaxHighlighter from "./CustomSyntaxHighlighter";
import { useTheme } from "next-themes";

const SectionCard = ({ icon: Icon, title, children, className = "", variant = "default" }) => {
  const variantStyles = {
    default: "border-border/50",
    primary: "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent",
    warning: "border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent",
    success: "border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent",
  };

  return (
    <Card className={`${variantStyles[variant]} ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className={`p-2 rounded-lg ${
            variant === "warning" ? "bg-orange-500/10" :
            variant === "success" ? "bg-green-500/10" :
            "bg-primary/10"
          }`}>
            <Icon className={`h-5 w-5 ${
              variant === "warning" ? "text-orange-500" :
              variant === "success" ? "text-green-500" :
              "text-primary"
            }`} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const TechBadge = ({ tech }) => (
  <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-colors">
    {tech}
  </Badge>
);

const StepCard = ({ step, isLast }) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative">
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
            {step.step}
          </div>
          {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary to-primary/20 my-2" />}
        </div>
        
        <div className="flex-1 pb-8">
          <div className="bg-muted/30 rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
              {step.title}
              {step.estimatedTime && (
                <Badge variant="outline" className="ml-auto text-xs font-normal">
                  <Clock className="h-3 w-3 mr-1" />
                  {step.estimatedTime}
                </Badge>
              )}
            </h4>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {step.description}
            </p>
            
            {step.deliverables && step.deliverables.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deliverables</span>
                <div className="flex flex-wrap gap-2">
                  {step.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-background/50 px-3 py-1.5 rounded-md border border-border/50">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {step.codeSnippet && (
              <div className="mt-4 rounded-lg overflow-hidden border border-border/50">
                <div className="bg-muted/50 px-3 py-2 flex items-center gap-2 border-b border-border/50">
                  <Code className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Code Example</span>
                </div>
                <CustomSyntaxHighlighter language="javascript" theme={theme}>
                  {step.codeSnippet}
                </CustomSyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MilestoneItem = ({ milestone, index }) => (
  <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-5 border border-primary/20">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Star className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{milestone.name}</h4>
        <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
        {milestone.checkpoints && milestone.checkpoints.length > 0 && (
          <div className="space-y-1.5">
            {milestone.checkpoints.map((cp, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {cp}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const MistakeCard = ({ mistake }) => (
  <div className="bg-orange-500/5 rounded-xl p-4 border border-orange-500/20">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-1">{mistake.mistake}</h4>
        <p className="text-sm text-muted-foreground">{mistake.solution}</p>
      </div>
    </div>
  </div>
);

const BestPracticeCard = ({ practice }) => (
  <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
    <div className="flex items-start gap-3">
      <Lightbulb className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium text-green-600 dark:text-green-400 mb-1">{practice.practice}</h4>
        <p className="text-sm text-muted-foreground">{practice.description}</p>
      </div>
    </div>
  </div>
);

const ImprovementCard = ({ improvement }) => {
  const difficultyColors = {
    easy: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  };

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          <h4 className="font-medium">{improvement.improvement}</h4>
        </div>
        {improvement.difficulty && (
          <Badge className={`text-xs ${difficultyColors[improvement.difficulty] || difficultyColors.medium}`}>
            {improvement.difficulty}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{improvement.description}</p>
    </div>
  );
};

const ResourceLink = ({ resource }) => {
  const typeIcons = {
    documentation: BookOpen,
    tutorial: BookMarked,
    tool: Zap,
  };
  const Icon = typeIcons[resource.type] || BookOpen;

  return (
    <a
      href={resource.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all group"
    >
      <div className="p-2 rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{resource.title}</h4>
        <span className="text-xs text-muted-foreground capitalize">{resource.type}</span>
      </div>
      {resource.url && (
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </a>
  );
};

const ArchitectureSection = ({ architecture }) => {
  const sections = [
    { key: "frontend", label: "Frontend", icon: Layout, items: architecture?.frontend || [] },
    { key: "backend", label: "Backend", icon: Server, items: architecture?.backend || [] },
    { key: "database", label: "Database", icon: Database, items: architecture?.database || [] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sections.map(({ key, label, icon: Icon, items }) => (
        <div key={key} className="bg-muted/30 rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium text-sm">{label}</span>
          </div>
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-3 w-3 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">Not specified</p>
          )}
        </div>
      ))}
    </div>
  );
};

const ProjectGuidanceRenderer = ({ guidance }) => {
  if (!guidance) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4 pb-6 border-b border-border/50">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Target className="h-4 w-4" />
          Project Guidance
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {guidance.projectTitle}
        </h1>
        {guidance.overview && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {guidance.overview}
          </p>
        )}
      </div>

      {guidance.techStack && guidance.techStack.length > 0 && (
        <SectionCard icon={Code} title="Tech Stack" variant="primary">
          <div className="flex flex-wrap gap-2">
            {guidance.techStack.map((tech, i) => (
              <TechBadge key={i} tech={tech} />
            ))}
          </div>
        </SectionCard>
      )}

      {guidance.architecture && (
        <SectionCard icon={Layout} title="Architecture Overview">
          <ArchitectureSection architecture={guidance.architecture} />
        </SectionCard>
      )}

      {guidance.stepByStepPlan && guidance.stepByStepPlan.length > 0 && (
        <SectionCard icon={Target} title="Step-by-Step Plan" variant="primary">
          <div className="mt-2">
            {guidance.stepByStepPlan.map((step, i) => (
              <StepCard 
                key={step.step || i} 
                step={step} 
                isLast={i === guidance.stepByStepPlan.length - 1} 
              />
            ))}
          </div>
        </SectionCard>
      )}

      {guidance.milestones && guidance.milestones.length > 0 && (
        <SectionCard icon={Star} title="Project Milestones">
          <div className="grid gap-4">
            {guidance.milestones.map((m, i) => (
              <MilestoneItem key={i} milestone={m} index={i} />
            ))}
          </div>
        </SectionCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidance.commonMistakes && guidance.commonMistakes.length > 0 && (
          <SectionCard icon={AlertTriangle} title="Common Mistakes" variant="warning">
            <div className="space-y-3">
              {guidance.commonMistakes.map((m, i) => (
                <MistakeCard key={i} mistake={m} />
              ))}
            </div>
          </SectionCard>
        )}

        {guidance.bestPractices && guidance.bestPractices.length > 0 && (
          <SectionCard icon={Lightbulb} title="Best Practices" variant="success">
            <div className="space-y-3">
              {guidance.bestPractices.map((p, i) => (
                <BestPracticeCard key={i} practice={p} />
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {guidance.nextImprovements && guidance.nextImprovements.length > 0 && (
        <SectionCard icon={Rocket} title="Future Improvements">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guidance.nextImprovements.map((imp, i) => (
              <ImprovementCard key={i} improvement={imp} />
            ))}
          </div>
        </SectionCard>
      )}

      {guidance.resources && guidance.resources.length > 0 && (
        <SectionCard icon={BookOpen} title="Helpful Resources">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guidance.resources.map((r, i) => (
              <ResourceLink key={i} resource={r} />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ProjectGuidanceRenderer;
