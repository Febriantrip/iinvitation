import type { TemplateLayout } from '../../../lib/themes'
import type { InvitationTemplateProps } from './shared'
import { EditorialSplitTemplate } from './EditorialSplitTemplate'
import { NewspaperTemplate } from './NewspaperTemplate'
import { CinematicChaptersTemplate } from './CinematicChaptersTemplate'
import { ScrapbookTemplate } from './ScrapbookTemplate'
import { IslamicArchTemplate } from './IslamicArchTemplate'
import { MuseumTemplate } from './MuseumTemplate'
import { StorybookTemplate } from './StorybookTemplate'
import { BentoTemplate } from './BentoTemplate'
import { ModernArchTemplate } from './ModernArchTemplate'
import { HeritageArunaTemplate } from './HeritageArunaTemplate'
import { PremiumIvannaTemplate } from './PremiumIvannaTemplate'
import { PremiumFlawlessTemplate } from './PremiumFlawlessTemplate'
import { HeritageUtaryTemplate } from './attariCollection/HeritageUtaryTemplate'
import { HeritageSandhayuTemplate } from './attariCollection/HeritageSandhayuTemplate'
import { HeritageAmeeraTemplate } from './attariCollection/HeritageAmeeraTemplate'
import { PremiumFlaraTemplate } from './attariCollection/PremiumFlaraTemplate'
import { PremiumKilaTemplate } from './attariCollection/PremiumKilaTemplate'
import { PremiumDanilaTemplate } from './attariCollection/PremiumDanilaTemplate'
import { PremiumBeancaTemplate } from './attariCollection/PremiumBeancaTemplate'
import { PremiumAriyaTemplate } from './attariCollection/PremiumAriyaTemplate'
import { PremiumAlyssaTemplate } from './attariCollection/PremiumAlyssaTemplate'
import { PremiumShakiraTemplate } from './attariCollection/PremiumShakiraTemplate'
import { PremiumEndlessLoveTemplate } from './attariCollection/PremiumEndlessLoveTemplate'
import { PremiumSageTemplate } from './attariCollection/PremiumSageTemplate'
import { MoodyPapercutTemplate } from './attariCollection/MoodyPapercutTemplate'
import { MoodyWaveTemplate } from './attariCollection/MoodyWaveTemplate'
import { MoodySweetpinkTemplate } from './attariCollection/MoodySweetpinkTemplate'

export function StructuralTemplateRenderer({ layout, props }: { layout: TemplateLayout; props: InvitationTemplateProps }) {
  switch (layout) {
    case 'editorial-split': return <EditorialSplitTemplate {...props}/>
    case 'newspaper': return <NewspaperTemplate {...props}/>
    case 'cinematic-chapters': return <CinematicChaptersTemplate {...props}/>
    case 'scrapbook': return <ScrapbookTemplate {...props}/>
    case 'islamic-arch': return <IslamicArchTemplate {...props}/>
    case 'museum': return <MuseumTemplate {...props}/>
    case 'storybook': return <StorybookTemplate {...props}/>
    case 'bento': return <BentoTemplate {...props}/>
    case 'modern-arch': return <ModernArchTemplate {...props}/>
    case 'heritage-aruna': return <HeritageArunaTemplate {...props}/>
    case 'premium-ivanna': return <PremiumIvannaTemplate {...props}/>
    case 'premium-flawless': return <PremiumFlawlessTemplate {...props}/>
    case 'heritage-utary': return <HeritageUtaryTemplate {...props}/>
    case 'heritage-sandhayu': return <HeritageSandhayuTemplate {...props}/>
    case 'heritage-ameera': return <HeritageAmeeraTemplate {...props}/>
    case 'premium-flara': return <PremiumFlaraTemplate {...props}/>
    case 'premium-kila': return <PremiumKilaTemplate {...props}/>
    case 'premium-danila': return <PremiumDanilaTemplate {...props}/>
    case 'premium-beanca': return <PremiumBeancaTemplate {...props}/>
    case 'premium-ariya': return <PremiumAriyaTemplate {...props}/>
    case 'premium-alyssa': return <PremiumAlyssaTemplate {...props}/>
    case 'premium-shakira': return <PremiumShakiraTemplate {...props}/>
    case 'premium-endless-love': return <PremiumEndlessLoveTemplate {...props}/>
    case 'premium-sage': return <PremiumSageTemplate {...props}/>
    case 'moody-papercut': return <MoodyPapercutTemplate {...props}/>
    case 'moody-wave': return <MoodyWaveTemplate {...props}/>
    case 'moody-sweetpink': return <MoodySweetpinkTemplate {...props}/>
    default: return null
  }
}

export type { InvitationTemplateProps } from './shared'
export { Countdown, EditedImage } from './shared'
