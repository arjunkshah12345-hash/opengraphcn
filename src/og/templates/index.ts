import type { TemplateDef } from '../core/types'
import { monograph } from './monograph'
import { journal } from './journal'
import { modernist } from './modernist'
import { typeStudy } from './type-study'
import { cover } from './cover'
import { terminal } from './terminal'
import { codebase } from './codebase'
import { gitCommit } from './git-commit'
import { blueprint } from './blueprint'
import { system } from './system'
import { atmosphere } from './atmosphere'
import { liquid } from './liquid'
import { chromatic } from './chromatic'
import { nocturne } from './nocturne'
import { spectrum } from './spectrum'
import { nothing } from './nothing'
import { index } from './index-catalog'
import { canvas } from './canvas'
import { mono } from './mono'
import { frame } from './frame'
import { brutalist } from './brutalist'
import { pixel } from './pixel'
import { dither } from './dither'
import { halftone } from './halftone'
import { poster } from './poster'
import { launch } from './launch'
import { showcase } from './showcase'
import { announcement } from './announcement'
import { founder } from './founder'
import { repository } from './repository'

/** all 30 templates, in catalogue order */
export const TEMPLATES: TemplateDef[] = [
  monograph,
  journal,
  modernist,
  typeStudy,
  cover,
  terminal,
  codebase,
  gitCommit,
  blueprint,
  system,
  atmosphere,
  liquid,
  chromatic,
  nocturne,
  spectrum,
  nothing,
  index,
  canvas,
  mono,
  frame,
  brutalist,
  pixel,
  dither,
  halftone,
  poster,
  launch,
  showcase,
  announcement,
  founder,
  repository,
]

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
