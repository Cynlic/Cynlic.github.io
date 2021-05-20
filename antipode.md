---
layout: page
title: antiPode
---

![header](/assets/grass.jpeg){:class="img-responsive"}

## Introduction

It is hard to live in Austin long and not notice the abundance of green space which threads through the city in a series of greenbelts, metropolitan parks, and natural landmarks.
Such spaces have long been a major part of the city's planned attraction of knowledge workers, and have offered a manicured commons for hiking, biking, rock climbing, water activities and more.
However, as Andrew Busch (2017) contends, the taut loop of rhetoric which surrounds environmentalism, sustainablity, and "greenness" has long been a entwined with the city's "progressive investment in whiteness." 
Austin's production of an interface between burgeoning technopolis and delicately maintained garden has engendered inequities across lines of race and class which reframe the experience of these spaces as fraught forms of recreation.

The antiPode is an experimental object which asks a simple question: _how can we listen against the grain of the environmental narrative?_
While the project is theoretically ongoing, it has taken definable shape as a three step process: 
1. Make recordings of Austin green spaces, attempting to focus on features of their emplacement in the city (i.e. emphasize the unique ways they mediate traffic noise rather than idyllic bird song). 
2. Remediate recordings by applying effects of sound design such as filtering, feedback, delay, and so forth.
3. Dynamically mix original and remediated recordings via hardware sensors.

Here you will find a sampling of recordings I have made (they are pseudo-binaural so headphones work best) on a custom google map of the approximate location where I took them. 
Click on the markers to listen! 
Below are descriptions of the antiPode, how I made it, and a short performance with it. 

{% include google-map.html %}

## Listening With Sensors

My plan for the antiPode was to create an object which you could take on a hike, plug it into the soil, and listen to an acoustic environment which was in some moments radically different and in others nearly identical to the sound just beyond your headphones.
My platform of choice was the [bela](https://bela.io), a computer roughly the size of a large wallet which is capable of running high performance audio-code. 
After much testing, the easiest solution was to connect a series of sensors from the maker platform [adafruit](https://www.adafruit.com/), such as [this soil sensor](https://www.adafruit.com/product/4026).

Unfortunately, getting data to-and-from the bela was a complex task, so the sensors connect to an [RP2040-based microcontroller](https://www.adafruit.com/product/4884) which polls them for data and communicates with the bela via USB. 
This isn't an ideal setup for complex reasons such as the encoding of numerical data into text, but it has the benefit of being very simple to tinker with. 
Here is a diagram of the sensors connection, as well as the entirety of the microcontroller code, which sets up the sensors on boot and pipes their data to the bela: 


![diagram](/assets/antiPode.jpg){:class="img-responsive"}

<!-- HTML generated using hilite.me --><div style="background: #272822; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #75715e"># import libraries provided by adafruit</span>

<span style="color: #f92672">import</span> <span style="color: #f8f8f2">time</span>
<span style="color: #f92672">import</span> <span style="color: #f8f8f2">adafruit_bmp280</span>     
<span style="color: #f92672">import</span> <span style="color: #f8f8f2">adafruit_tsl2591</span>
<span style="color: #f92672">from</span> <span style="color: #f8f8f2">board</span> <span style="color: #f92672">import</span> <span style="color: #f8f8f2">SCL,</span> <span style="color: #f8f8f2">SDA</span>
<span style="color: #f92672">import</span> <span style="color: #f8f8f2">busio</span>
<span style="color: #f92672">from</span> <span style="color: #f8f8f2">adafruit_seesaw.seesaw</span> <span style="color: #f92672">import</span> <span style="color: #f8f8f2">Seesaw</span>

<span style="color: #75715e"># set up our sensors     </span>
<span style="color: #f8f8f2">i2c_bus</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">busio</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">I2C(SCL,</span> <span style="color: #f8f8f2">SDA)</span>     
<span style="color: #f8f8f2">seesaw</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Seesaw(i2c_bus,</span> <span style="color: #f8f8f2">addr</span><span style="color: #f92672">=</span><span style="color: #ae81ff">0x36</span><span style="color: #f8f8f2">)</span>
<span style="color: #f8f8f2">sensor</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">adafruit_bmp280</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">Adafruit_BMP280_I2C(i2c_bus)</span>
<span style="color: #f8f8f2">light</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">adafruit_tsl2591</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">TSL2591(i2c_bus)</span>
<span style="color: #f8f8f2">sensor</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">sea_level_pressure</span> <span style="color: #f92672">=</span> <span style="color: #ae81ff">1004.6</span> 
<span style="color: #f8f8f2">light</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">gain</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">adafruit_tsl2591</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">GAIN_LOW</span>

<span style="color: #75715e"># create an infinite loop for sensing</span>
<span style="color: #66d9ef">while</span> <span style="color: #f8f8f2">True:</span>
    <span style="color: #75715e"># read moisture level through capacitive touch pad</span>
    <span style="color: #f8f8f2">touch</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">seesaw</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">moisture_read()</span>
    <span style="color: #75715e"># read temperature from the temperature sensor</span>
    <span style="color: #f8f8f2">temp</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">seesaw</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">get_temp()</span>
    <span style="color: #f8f8f2">alt</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">sensor</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">altitude</span>
    <span style="color: #f8f8f2">lux</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">light</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">lux</span>

<span style="color: #75715e"># send data to the bela with a 0.002 second delay between each sensor&#39;s output </span>

    <span style="color: #66d9ef">print</span><span style="color: #f8f8f2">(</span><span style="color: #e6db74">&quot;T: &quot;</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">str(temp))</span>
    <span style="color: #f8f8f2">time</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">sleep(</span><span style="color: #ae81ff">0.002</span><span style="color: #f8f8f2">)</span>
    <span style="color: #66d9ef">print</span><span style="color: #f8f8f2">(</span><span style="color: #e6db74">&quot;M: &quot;</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">str(touch))</span>
    <span style="color: #f8f8f2">time</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">sleep(</span><span style="color: #ae81ff">0.002</span><span style="color: #f8f8f2">)</span>
    <span style="color: #66d9ef">print</span><span style="color: #f8f8f2">(</span><span style="color: #e6db74">&quot;A: &quot;</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">str(alt))</span>
    <span style="color: #f8f8f2">time</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">sleep(</span><span style="color: #ae81ff">0.002</span><span style="color: #f8f8f2">)</span>
    <span style="color: #66d9ef">print</span><span style="color: #f8f8f2">(</span><span style="color: #e6db74">&quot;L: &quot;</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">str(lux))</span>
    <span style="color: #f8f8f2">time</span><span style="color: #f92672">.</span><span style="color: #f8f8f2">sleep(</span><span style="color: #ae81ff">0.002</span><span style="color: #f8f8f2">)</span>
</pre></div>

## Performance and Audio Design

The antiPode currently creates two stereo wavetable oscillators which hold the contents of the recordings and remediations in RAM. 
This immediately presents a problem, insofar as RAM on the bela is limited. 
Future versions of the antiPode should remediate the recordings on the fly within the audio code itself, reducing the RAM footprint. 
Currently configured, the antiPode is mainly responsive to soil moisture and light, measured in lux. These two values control the playback speed of the oscillators and their respective volumes, providing a dynamic performance in a variety of conditions.
The bela's stereo output makes it perfectly capable of listening to the antiPode with headphones or through a more complex setup for live performance. 

Below is a demo performance which runs the antiPode through some external effects and amplification. 
Currently my amplification setup only allows for mono output, but the experience of dueting with the birds in the back yard was worth the loss of channels. 



{% include youtubePlayer.html id="Hw6SO5-31pw" %}

## Further Work

Like many of my projects, the antiPode is somewhere between system, practice, and object. 
It is entirely modular and subject to change, particularly as I become more comfortable with low level digital signal processing. 
This page will be updated with further work, more explorations, and new ways to listen, so make sure to stop by again in a few months. 
