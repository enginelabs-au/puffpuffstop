import type { OrganId } from "../domain/organs";

export type ScienceSource = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  organs: OrganId[];
  summary: string;
  url: string;
};

export const SCIENCE_DISCLAIMER =
  "These papers describe population and lab findings. In-app organ percents are motivational estimates, not a diagnosis or a personal medical reading.";

/** Peer-reviewed sources used to weight the 50-year organ model. */
export const SCIENCE_SOURCES: readonly ScienceSource[] = [
  {
    id: "gordon-2023-aggregate",
    title: "Electronic Cigarette Harms: Aggregate Evidence Shows Damage to Biological Systems",
    authors: "Gordon T, Fine J, et al.",
    year: 2023,
    venue: "Int J Environ Res Public Health",
    organs: ["lungs", "heart", "brain"],
    summary:
      "Narrative review of 2022–2023 systematic reviews on respiratory, cardiovascular, and neurological effects of e-cigarettes.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10572885/",
  },
  {
    id: "tid-2024-respiratory",
    title:
      "Evidence update on the respiratory health effects of vaping e-cigarettes: A systematic review and meta-analysis",
    authors: "Asfar T, et al.",
    year: 2024,
    venue: "Tobacco Induced Diseases",
    organs: ["lungs"],
    summary:
      "Non-smoker current vapers had higher incident respiratory symptoms than never users (RR 1.90; 95% CI 1.28–2.83). Certainty was low to very low.",
    url: "https://www.tobaccoinduceddiseases.org/Evidence-update-on-the-respiratory-health-effects-of-vaping-e-cigarettes-A-systematic,209954,0,2.html",
  },
  {
    id: "erj-2023-lung-structure",
    title: "Nicotine promotes e-cigarette vapour-induced lung inflammation and structural alterations",
    authors: "Roxlau ET, et al.",
    year: 2023,
    venue: "European Respiratory Journal",
    organs: ["lungs"],
    summary:
      "Eight-month mouse exposure to nicotine-containing vapour increased lung inflammation and airspace (about 17.5% vs control), in the range of mild smoke-like change—not end-stage disease.",
    url: "https://publications.ersnet.org/content/erj/61/6/2200951",
  },
  {
    id: "annurev-2025-multisystem",
    title:
      "Multisystem Toxicity of E-Cigarettes in Preclinical and Clinical Studies: Pathophysiologic Effects from Head to Toe",
    authors: "Park JA, Crotty Alexander LE, et al.",
    year: 2025,
    venue: "Annu Rev Pharmacol Toxicol",
    organs: ["lungs", "heart", "brain", "liver", "mouth"],
    summary:
      "Head-to-toe review: oral and airway irritation, endothelial and cardiac stress, neuroinflammation signals, and mostly preclinical liver inflammation, oxidative stress, and fibrosis after months of exposure.",
    url: "https://doi.org/10.1146/annurev-pharmtox-062124-022856",
  },
  {
    id: "ahajournals-cv",
    title: "Cardiovascular effects of electronic cigarettes",
    authors: "American Heart Association scientific statements and related reviews",
    year: 2023,
    venue: "Circulation / related AHA literature",
    organs: ["heart"],
    summary:
      "E-cigarette aerosol is linked to acute heart-rate and blood-pressure rises and endothelial dysfunction. Long-term human disease risk is still being measured, so heart scores move slower than lung scores.",
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001160",
  },
  {
    id: "oral-2023-hygiene",
    title: "Electronic cigarettes and oral health: a narrative review",
    authors: "Abbott AJ, et al.",
    year: 2023,
    venue: "Journal of Dental Hygiene",
    organs: ["mouth"],
    summary:
      "Reviews report oral mucosal irritation, gingival inflammation, and microbiome shifts in e-cigarette users. Changes can appear earlier than deep organ disease.",
    url: "https://pubmed.ncbi.nlm.nih.gov/37142440/",
  },
];

export function scienceSourcesFor(organ: OrganId): ScienceSource[] {
  return SCIENCE_SOURCES.filter((row) => row.organs.includes(organ));
}
