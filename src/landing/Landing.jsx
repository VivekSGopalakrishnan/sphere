import React from 'react'
import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap'
import './Landing.css'

const Landing = () => {
    useEffect(() => {

        //Scene
        const scene = new THREE.Scene()

        const geometry = new THREE.SphereGeometry(3, 128, 128)
        const material = new THREE.MeshStandardMaterial({
            color: "#00ff83",
            roughness:0.4
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        //Sizes

        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        //Lights

        const lights = new THREE.PointLight(0xffffff, 1, 100)
        lights.position.set(0, 10, 10)
        lights.intensity=1.4
        scene.add(lights)
        //Camera

        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
        camera.position.z = 25
        scene.add(camera)

        const canvas = document.getElementById("webgl")
        const renderer = new THREE.WebGL1Renderer({ canvas })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(3)
        renderer.render(scene, camera)

        //Resize

        window.addEventListener("resize", () => {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            camera.updateProjectionMatrix()
            camera.aspect = sizes.width / sizes.height
            renderer.setSize(sizes.width, sizes.height)
        })

        //controls

        const controls = new OrbitControls(camera, canvas)
        controls.enablePan = false
        controls.enableZoom = false
        controls.enableDamping = true
        controls.autoRotate = true
        controls.autoRotateSpeed = 6
        const loop = () => {
            controls.update()
            renderer.render(scene, camera)
            window.requestAnimationFrame(loop)

        }
        loop()

        const tl = gsap.timeline({ defaults: { duration: 1 } })
        tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
        tl.fromTo(".nav", { y: '-100%' }, { y: '0%' })
        tl.fromTo(".spin", { opacity: 0 }, { opacity: 1 })

        //pointerdown

        let pointerDown = false
        let rgb = []

        window.addEventListener("pointerdown", () => (pointerDown = true))
        window.addEventListener("pointerup", () => (pointerDown = false))

        window.addEventListener("pointermove", (e) => {
            if (pointerDown) {
                rgb = [
                    Math.round((e.pageX / sizes.width) * 255),
                    Math.round((e.pageY / sizes.height) * 255),
                    150
                ]
                //animation
                let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
                gsap.to(mesh.material.color, {
                    r: newColor.r,
                    g: newColor.g,
                    b: newColor.b,

                })
            }
        })



    })
    return (
        <div className='landing'>
            <canvas className='webgl' id='webgl'></canvas>
            <div className='nav'>
                <div className='logo'>
                    Sphere
                </div>
                <ul className='nav-list'>
                    <li>Explore</li>
                    <li>Create</li>

                </ul>
            </div>
            <div className='spin'>
                Give it a spin
            </div>
        </div>

    )
}

export default Landing