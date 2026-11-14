import type { TemplateDef } from '../core/types'
import { abstract } from './abstract'
import { developer } from './developer'
import { editorial } from './editorial'
import { experimental } from './experimental'
import { minimal } from './minimal'
import { product } from './product'

export const TEMPLATES: TemplateDef[] = [...editorial, ...developer, ...abstract, ...minimal, ...experimental, ...product]

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
