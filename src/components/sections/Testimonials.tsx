"use client";

import { useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";

const testimonialsFr = [
  {
    quote: "Le système SCI Metallic a complètement transformé notre showroom. Les clients sont impressionnés dès qu'ils entrent. Installation impeccable.",
    name: "Marc Tremblay",
    title: "Concessionnaire automobile, Montréal",
  },
  {
    quote: "On a essayé 3 fournisseurs avant Novus. La différence de qualité est flagrante. Le polyuréa résiste au sel québécois comme rien d'autre.",
    name: "Sophie Lavoie",
    title: "Propriétaire de garage, Québec",
  },
  {
    quote: "Support technique exceptionnel. Michael chez SCI nous a guidés à chaque étape. Le résultat est digne d'un magazine.",
    name: "Jean-Philippe Côté",
    title: "Entrepreneur général, Laval",
  },
  {
    quote: "On a fait tout le plancher de notre entrepôt de 15,000 pi². Livraison rapide, produit solide. Ça fait 2 ans et pas une seule fissure.",
    name: "David Chen",
    title: "Directeur d'usine, Toronto",
  },
  {
    quote: "Le calculateur en ligne nous a donné un prix juste. Pas de surprise à la livraison. Exactement ce qu'on cherchait pour notre restaurant.",
    name: "Marie-Ève Bouchard",
    title: "Restauratrice, Sherbrooke",
  },
];

const testimonialsEn = [
  {
    quote: "The SCI Metallic system completely transformed our showroom. Customers are impressed the moment they walk in. Flawless installation.",
    name: "Marc Tremblay",
    title: "Car dealership, Montreal",
  },
  {
    quote: "We tried 3 suppliers before Novus. The quality difference is striking. The polyurea stands up to Quebec salt like nothing else.",
    name: "Sophie Lavoie",
    title: "Garage owner, Quebec City",
  },
  {
    quote: "Exceptional technical support. Michael at SCI guided us every step of the way. The result is magazine-worthy.",
    name: "Jean-Philippe Côté",
    title: "General contractor, Laval",
  },
  {
    quote: "We did our entire 15,000 sq ft warehouse floor. Fast delivery, solid product. It's been 2 years and not a single crack.",
    name: "David Chen",
    title: "Plant manager, Toronto",
  },
  {
    quote: "The online calculator gave us a fair price. No surprises at delivery. Exactly what we were looking for for our restaurant.",
    name: "Marie-Ève Bouchard",
    title: "Restaurant owner, Sherbrooke",
  },
];

export function Testimonials() {
  const locale = useLocale() as "fr" | "en";
  const items = locale === "fr" ? testimonialsFr : testimonialsEn;

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <Container>
        <SectionHeader
          title={locale === "fr" ? "Ce que nos clients disent" : "What Our Clients Say"}
          subtitle={
            locale === "fr"
              ? "Des entrepreneurs et propriétaires qui ont choisi Novus Surfaces"
              : "Contractors and owners who chose Novus Surfaces"
          }
        />
      </Container>

      <div className="mt-12">
        <InfiniteMovingCards items={items} direction="left" speed="slow" />
      </div>
    </section>
  );
}
