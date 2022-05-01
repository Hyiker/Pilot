#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

highp vec4 textureLut(in highp vec3 color, in sampler2D lutSampler)
{
    highp ivec2 texSize = textureSize(lutSampler, 0);
    highp int   len     = texSize.y;
    highp float flen    = float(len);
    // blue layer
    highp float w   = color.b * float(texSize.x / len);
    highp float w0  = floor(w);
    highp float w1  = ceil(w);
    highp vec2  uv0 = vec2((color.r + w0) * flen / float(texSize.x), color.g);
    highp vec2  uv1 = vec2((color.r + w1) * flen / float(texSize.x), color.g);
    return mix(texture(lutSampler, uv0), texture(lutSampler, uv1), w - w0);
}

void main()
{
    highp vec4 color = subpassLoad(in_color).rgba;
    out_color        = textureLut(color.rgb, color_grading_lut_texture_sampler);
}