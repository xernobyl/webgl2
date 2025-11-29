/*
TODO: store the normals using Fibonacci spiral
*/

import { StaticGeometry } from './staticgeometry.js'

export function parseObj(text) {
  const vertices =

  const vertices = []
  const normals = []
  const uvs = []
  const faces = []

  const lines = text.split('\n')

  for (const line of lines) {
    const parts = line.trim().split(/\s+/)
    const [prefix] = parts

    if (prefix === 'v') {
      vertices.push(parts.slice(1).map(Number))
    } else if (prefix === 'vn') {
      normals.push(parts.slice(1).map(Number))
    } else if (prefix === 'vt') {
      uvs.push(parts.slice(1).map(Number))
    } else if (prefix === 'f') {
      const face = parts.slice(1).map(p => {
        const [v, vt, vn] = p.split('/').map(val => val ? parseInt(val, 10) - 1 : null)
        return { v, vt, vn }
      })
      faces.push(face)
    }
  }

  return {
    vertices,
    normals,
    uvs,
    faces
  }
}

export function processMesh(mesh) {
  for (const i = 0; i < length(mesh.vertices); i++) {

  }
}

export function loadObj(data) {
  const mesh = parseObj(data)

  const vertexOffet = StaticGeometry.addVertices(vertexBuffer)
  const elementOffset = StaticGeometry.addElements(indicesBuffer)
}
