'use strict'

const cube = {
  init : function() {
    const vertexBuffer = new Int8Array([1,1,1,0,0,1,1,1,-1,1,1,0,0,1,0,1,-1,-1,1,0,0,1,0,0,1,-1,1,0,0,1,1,0,1,1,1,1,0,0,0,1,1,-1,1,1,0,0,0,0,1,-1,-1,1,0,0,1,0,1,1,-1,1,0,0,1,1,1,1,1,0,1,0,1,0,1,1,-1,0,1,0,1,1,-1,1,-1,0,1,0,0,1,-1,1,1,0,1,0,0,0,-1,1,1,-1,0,0,1,1,-1,1,-1,-1,0,0,0,1,-1,-1,-1,-1,0,0,0,0,-1,-1,1,-1,0,0,1,0,-1,-1,-1,0,-1,0,0,0,1,-1,-1,0,-1,0,1,0,1,-1,1,0,-1,0,1,1,-1,-1,1,0,-1,0,0,1,1,-1,-1,0,0,-1,0,0,-1,-1,-1,0,0,-1,1,0,-1,1,-1,0,0,-1,1,1,1,1,-1,0,0,-1,0,1])
    const indicesBuffer = new Uint8Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23])
		
		this.vao = gl.createVertexArray()
		gl.bindVertexArray(this.vao)

    let vertexOffet = staticGeometry.addVertices(vertexBuffer)
		this.elementOffset = staticGeometry.addElements(indicesBuffer)

		gl.vertexAttribPointer(0, 3, gl.BYTE, false, 8, vertexOffet + 0)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(1, 3, gl.BYTE, false, 8, vertexOffet + 3)
    gl.enableVertexAttribArray(1)
    gl.vertexAttribPointer(2, 2, gl.BYTE, false, 8, vertexOffet + 6)
    gl.enableVertexAttribArray(2)
  },

  draw: function() {
		gl.bindVertexArray(this.vao)    
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, this.elementOffset)
	}
}
